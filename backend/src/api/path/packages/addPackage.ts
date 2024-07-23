import type { Request, Response } from 'express';

import { Prisma } from '@prisma/client';

import fetcherApi from '@/aur/fetcher';
import { prisma } from '@/database/db';
import {
    errorResponse, ErrorResponseThrowable, requireBodyParams, successResponse,
} from '@/helper/api';
import {
    existsInAur, stripPkgName,
} from '@/helper/aur';
import taskQueue from '@/taskmanager';

const requiredParams = ['name'] as const;

export default async function addPackage(req: Request, res: Response): Promise<void> {
    const params = requireBodyParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from body');
        return;
    }

    const lookupPackageEndpoint = fetcherApi('/rpc/v5/info/{arg}').method('get').create();

    const alreadyBuildPackages = await prisma.aurPackage.findMany({
        select: {
            name: true,
        },
    });

    const packageList: string[] = alreadyBuildPackages.map((pkg) => pkg.name);

    try {
        const handleAddPackage = async (packageName: string): Promise<void> => {
            if (packageList.includes(packageName)) {
                // dependency cycle
                console.log('Dependency cycle detected', packageName);
                return;
            }

            packageList.push(packageName);

            console.log('Adding package', packageName);

            const response = await lookupPackageEndpoint({
                arg: packageName,
            });

            if (!response.ok) {
                throw new ErrorResponseThrowable(500, 'Failed to get AUR info', response);
            }

            if (!response.data.results?.length) {
                throw new ErrorResponseThrowable(404, 'Package not found', response);
            }

            if (response.data.results.length !== 1 || !response.data.results[0]) {
                throw new ErrorResponseThrowable(500, 'Invalid package data', response);
            }

            const packageData = response.data.results[0];

            const {
                ID,
                Name,
                Description,
                PackageBaseID,
                PackageBase,
                Maintainer,
                NumVotes,
                Popularity,
                FirstSubmitted,
                LastModified,
                OutOfDate,
                Version,
                URLPath,
                URL,
            } = packageData;

            if (
                typeof ID === 'undefined'
                || typeof Name === 'undefined'
                || typeof Description === 'undefined'
                || typeof PackageBaseID === 'undefined'
                || typeof PackageBase === 'undefined'
                || typeof Maintainer === 'undefined'
                || typeof NumVotes === 'undefined'
                || typeof Popularity === 'undefined'
                || typeof FirstSubmitted === 'undefined'
                || typeof LastModified === 'undefined'
                || typeof OutOfDate === 'undefined'
                || typeof Version === 'undefined'
                || typeof URLPath === 'undefined'
                || typeof URL === 'undefined'
            ) {
                throw new ErrorResponseThrowable(500, 'Invalid package data', {
                    ID: `ID: ${typeof ID}`,
                    Name: `Name: ${typeof Name}`,
                    Description: `Description: ${typeof Description}`,
                    PackageBaseID: `PackageBaseID: ${typeof PackageBaseID}`,
                    PackageBase: `PackageBase: ${typeof PackageBase}`,
                    Maintainer: `Maintainer: ${typeof Maintainer}`,
                    NumVotes: `NumVotes: ${typeof NumVotes}`,
                    Popularity: `Popularity: ${typeof Popularity}`,
                    FirstSubmitted: `FirstSubmitted: ${typeof FirstSubmitted}`,
                    LastModified: `LastModified: ${typeof LastModified}`,
                    OutOfDate: `OutOfDate: ${typeof OutOfDate}`,
                    Version: `Version: ${typeof Version}`,
                    URLPath: `URLPath: ${typeof URLPath}`,
                    URL: `URL: ${typeof URL}`,
                });
            }

            const dependencies: string[] = [
                ...(typeof packageData.Depends !== 'undefined' ? packageData.Depends : []),
                ...(typeof packageData.MakeDepends !== 'undefined' ? packageData.MakeDepends : []),
                ...(typeof packageData.CheckDepends !== 'undefined' ? packageData.CheckDepends : []),
                ...(typeof packageData.OptDepends !== 'undefined' ? packageData.OptDepends : []),
            ];

            const mappedDependencyPromises = dependencies.map(async (dep) => ({
                packageName: dep,
                strippedPackageName: stripPkgName(dep),
                isAur: await existsInAur(dep),
            }));

            const mappedDependencies = await Promise.all(mappedDependencyPromises);

            const aurDependencyPromises = mappedDependencies.filter((dep) => dep.isAur).map(async (dep) => handleAddPackage(stripPkgName(dep.packageName)));

            await Promise.all(aurDependencyPromises);

            const prismaResult = await prisma.aurPackage.create({
                data: {
                    packageId: ID,
                    name: Name,
                    description: Description,
                    packageBaseId: PackageBaseID,
                    packageBase: PackageBase,
                    maintainer: Maintainer,
                    votes: NumVotes,
                    popularity: Popularity,
                    firstSubmitted: (new Date(FirstSubmitted * 1000)).toISOString(),
                    lastModified: (new Date(LastModified * 1000)).toISOString(),
                    flaggedOutOfDate: OutOfDate !== null,
                    currentVersion: Version,
                    urlPath: URLPath,
                    url: URL,
                    ...(mappedDependencies.length > 0 ? {
                        dependencies: {
                            createMany: {
                                data: mappedDependencies,
                            },
                        },
                    } : {}),
                },
                select: {
                    name: true,
                    packageId: true,
                },
            });

            await taskQueue.add('handleNewPackage', {
                packageName: Name,
                packageId: prismaResult.packageId,
            });
        };

        await handleAddPackage(stripPkgName(params.name));

        successResponse<'/api/packages/add'>(res);
    } catch (e) {
        if (e instanceof ErrorResponseThrowable) {
            errorResponse(res, 500, e);
        } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                errorResponse(res, 409, 'Package already exists', undefined, {
                    message: e.message,
                });
                return;
            }

            errorResponse(res, 500, e.message, undefined, { e });
        } else if (e instanceof lookupPackageEndpoint.Error) {
            const error = e.getActualType();

            errorResponse(res, 500, error.data.error, undefined, {
                error,
            });
        } else {
            errorResponse(res, 500, undefined, undefined, {
                e,
            });
        }
    }
}
