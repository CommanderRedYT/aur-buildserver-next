import { Prisma } from '@prisma/client';

import fetcherApi from '@/aur/fetcher';
import { prisma } from '@/database/db';
import type { components } from '@/generated/aur';
import { existsInAur, stripPkgName } from '@/helper/aur';
import { updatePackage } from '@/pacman/build';
import type { ParsedPackageVersions } from '@/pacman/versions';
import { parseVersionsFromGit } from '@/pacman/versions';
import type { TaskFunction } from '@/taskmanager';
import taskQueue from '@/taskmanager';

const infoEndpoint = fetcherApi('/rpc/v5/info').method('get').create();

const checkAurForUpdates: TaskFunction = async (_, done): Promise<void> => {
    console.log('Checking AUR for updates');

    const packages = await prisma?.aurPackage.findMany({
        select: {
            name: true,
        },
    });

    if (!packages) {
        done();
        return;
    }

    const packageNames = packages.map((pkg) => pkg.name);

    const aurInfos = await infoEndpoint({
        'arg[]': packageNames,
    });

    if (!aurInfos.ok) {
        done(new Error('Failed to get AUR info'));
        return;
    }

    const { results } = aurInfos.data as { results: components['schemas']['PackageDetailed'][] };

    if (!results) {
        done(new Error('No results in AUR info'));
        return;
    }

    if (results.length !== packageNames.length) {
        done(new Error('Number of results does not match number of package names'));
        return;
    }

    for await (const pkg of results) {
        console.log('Updating package', pkg.Name);

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
        } = pkg;

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
            done(new Error('Invalid package data'));
            return;
        }

        const dependencies: string[] = [
            ...(typeof pkg.Depends !== 'undefined' ? pkg.Depends : []),
            ...(typeof pkg.MakeDepends !== 'undefined' ? pkg.MakeDepends : []),
            ...(typeof pkg.CheckDepends !== 'undefined' ? pkg.CheckDepends : []),
            ...(typeof pkg.OptDepends !== 'undefined' ? pkg.OptDepends : []),
        ];

        const mappedDependencyPromises = dependencies.map(async (dep) => ({
            packageName: dep,
            strippedPackageName: stripPkgName(dep),
            isAur: await existsInAur(dep),
        }));

        const mappedDependencies = await Promise.all(mappedDependencyPromises);

        const updateResult = await prisma.aurPackage.update({
            where: {
                name: pkg.Name,
            },
            data: {
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
                id: true,
            },
        });

        if (!updateResult) {
            done(new Error('Failed to update package'));
            return;
        }

        console.log('Updating meta data arrays for package', Name, updateResult.id);

        // TODO: update dependencies

        if (!updateResult) {
            done(new Error('Failed to update package'));
            return;
        }

        console.log('Updated package', Name);

        let gitDir: string | undefined;

        try {
            gitDir = await updatePackage(Name);
        } catch (e) {
            console.error('Failed to clone package', e);
            done(e as Error);
            return;
        }

        if (!gitDir) {
            done(new Error('Failed to clone package'));
            return;
        }

        let versions: ParsedPackageVersions['versions'] = {};
        let latestVersion: ParsedPackageVersions['latestVersion'];

        try {
            const parsed = await parseVersionsFromGit(gitDir);
            versions = parsed.versions;
            latestVersion = parsed.latestVersion;
        } catch (e) {
            console.error('Failed to parse versions from git', e);
            done(e as Error);
            return;
        }

        // Check handleNewPackage.ts for the same code
        const queries = Object.entries(versions).map(([, { pkgver, pkgrel, gitHash }]) => prisma.aurPackageVersion.upsert({
            where: {
                gitHash,
            },
            update: {
                pkgver,
                pkgrel,
            },
            create: {
                gitHash,
                pkgver,
                pkgrel,
                package: {
                    connect: {
                        packageId: ID,
                    },
                },
            },
        }));

        try {
            await prisma.$transaction(queries);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error', e);
                done(e);
            } else {
                console.error('Unknown error', e);
                done(e as Error);
            }
        }

        await taskQueue.add('buildPackage', {
            packageName: Name,
            version: latestVersion,
        });
    }

    done();
};

export default checkAurForUpdates;
