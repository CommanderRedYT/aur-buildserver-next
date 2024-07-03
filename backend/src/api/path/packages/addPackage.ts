import type { Request, Response } from 'express';

import { Prisma } from '@prisma/client';

import fetcherApi from '@/aur/fetcher';
import { prisma } from '@/database/db';
import { errorResponse, requireBodyParams, successResponse } from '@/helper/api';

const requiredParams = ['name'] as const;

export default async function addPackage(req: Request, res: Response): Promise<void> {
    const params = requireBodyParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from body');
        return;
    }

    const lookupPackageEndpoint = fetcherApi('/rpc/v5/info/{arg}').method('get').create();

    try {
        const response = await lookupPackageEndpoint({
            arg: params.name,
        });

        if (!response.ok) {
            errorResponse(res, 500);
            return;
        }

        if (!response.data.results?.length) {
            errorResponse(res, 404, 'Package not found');
            return;
        }

        if (response.data.results.length !== 1 || !response.data.results[0]) {
            errorResponse(res, 500);
            return;
        }

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
            License,
            Depends,
            MakeDepends,
            Keywords,
            CoMaintainers,
        } = response.data.results[0];

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
            errorResponse(res, 500, 'Invalid package data', {
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
            return;
        }

        await prisma.aurPackage.create({
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
                // arrays
                ...(typeof License !== 'undefined' ? {
                    licenses: {
                        createMany: {
                            data: License.map((item: string) => ({
                                license: item,
                            })),
                        },
                    },
                } : {}),
                ...(typeof Depends !== 'undefined' ? {
                    dependencies: {
                        createMany: {
                            data: Depends.map((item: string) => ({
                                packageName: item,
                            })),
                        },
                    },
                } : {}),
                ...(typeof MakeDepends !== 'undefined' ? {
                    makeDependencies: {
                        createMany: {
                            data: MakeDepends.map((item: string) => ({
                                packageName: item,
                            })),
                        },
                    },
                } : {}),
                ...(typeof CoMaintainers !== 'undefined' ? {
                    coMaintainers: {
                        createMany: {
                            data: CoMaintainers.map((item: string) => ({
                                name: item,
                            })),
                        },
                    },
                } : {}),
                ...(typeof Keywords !== 'undefined' ? {
                    keywords: {
                        connectOrCreate: Keywords.map((item: string) => ({
                            where: {
                                keyword: item,
                            },
                            create: {
                                keyword: item,
                            },
                        })),
                    },
                } : {}),
            },
        });

        successResponse<'/api/packages/add'>(res);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                errorResponse(res, 409, 'Package already exists', {
                    message: e.message,
                });
                return;
            }

            errorResponse(res, 500, e.message, { e });
        } else if (e instanceof lookupPackageEndpoint.Error) {
            const error = e.getActualType();

            errorResponse(res, 500, error.data.error, {
                error,
            });
        } else {
            errorResponse(res, 500, undefined, {
                e,
            });
        }
    }
}
