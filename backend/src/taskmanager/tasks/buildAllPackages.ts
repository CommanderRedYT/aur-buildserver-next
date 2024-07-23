import { prisma } from '@/database/db';
import exists from '@/helper/exists';
import { getPackageDirectory } from '@/pacman/build';
import type { ParsedPackageVersions } from '@/pacman/versions';
import { parseVersionsFromGit } from '@/pacman/versions';
import type { TaskFunction } from '@/taskmanager';
import taskQueue from '@/taskmanager';

const buildAllPackages: TaskFunction = async (_, done): Promise<void> => {
    console.log('Building all packages');

    const packages = await prisma?.aurPackage.findMany({
        select: {
            name: true,
        },
    });

    if (!packages) {
        done();
        return;
    }

    for await (const pkg of packages) {
        console.log('Building package', pkg.name);

        const gitDir = getPackageDirectory(pkg.name);

        if (!await exists(gitDir)) {
            console.warn('package git dir not found', pkg.name);
            continue;
        }

        let latestVersion: ParsedPackageVersions['latestVersion'];

        try {
            const parsed = await parseVersionsFromGit(gitDir);
            latestVersion = parsed.latestVersion;
        } catch (e) {
            console.error('Failed to parse versions from git', e);
            continue;
        }

        await taskQueue.add('buildPackage', {
            packageName: pkg.name,
            version: latestVersion,
        });
    }

    done();
};

export default buildAllPackages;
