import { Prisma } from '@prisma/client';

import { prisma } from '@/database/db';
import { clonePackage } from '@/pacman/build';
import type { ParsedPackageVersions } from '@/pacman/versions';
import { parseVersionsFromGit } from '@/pacman/versions';
import type { TaskFunction } from '@/taskmanager';
import taskQueue from '@/taskmanager';

export interface HandleNewPackageData {
    packageName: string;
    packageId: number;
}

const handleNewPackage: TaskFunction<HandleNewPackageData> = async (job, done) => {
    const parts = 2;

    await job.progress(0);

    console.log('Handling new package', job.data.packageName);

    let gitDir: string;

    try {
        gitDir = await clonePackage(job.data.packageName, (progress) => {
            job.progress(job.progress() + progress / parts);
        });
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

    // Check checkAurForUpdates.ts for the same code
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
                    packageId: job.data.packageId,
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
        packageName: job.data.packageName,
        version: latestVersion,
    });

    done();
};

export default handleNewPackage;
