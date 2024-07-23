import fs from 'fs/promises';

import { prisma } from '@/database/db';
import { stripPkgName } from '@/helper/aur';
import dependenciesNotBuilt from '@/helper/dependenciesNotBuilt';
import { ProcessLockTimeoutError } from '@/helper/processlock';
import {
    appendToBuildLog,
    executeBuild, getBuildLogPath, prepareBuild, scanForArtifacts, signArtifact,
} from '@/pacman/build';
import {
    addPackage, getPackagePath, getPackageSigPath, repoDb, repoDbFile, signDatabase,
} from '@/pacman/repo';
import type { ParsedPackageVersion } from '@/pacman/versions';
import type { TaskFunction } from '@/taskmanager';
import taskQueue from '@/taskmanager';

export interface HandleNewPackageData {
    packageName: string;
    version: ParsedPackageVersion;
    force?: boolean;
}

const buildPackage: TaskFunction<HandleNewPackageData> = async (job, done): Promise<void> => {
    console.log('Building package', job.data.packageName, job.data.version);

    if (!job.data.packageName || !job.data.version) {
        done(new Error('Package name and version are required'));
        return;
    }

    // return;

    const version = await prisma.aurPackageVersion.findFirst({
        where: {
            package: {
                name: job.data.packageName,
            },
            pkgver: job.data.version?.pkgver,
            pkgrel: job.data.version?.pkgrel,
            gitHash: job.data.version?.gitHash,
        },
        select: {
            versionId: true,
            gitHash: true,
        },
    });

    if (!version) {
        done(new Error('Version not found in database'));
        return;
    }

    const existingSuccessfulBuild = await prisma.aurPackageBuild.findFirst({
        where: {
            package: {
                name: job.data.packageName,
            },
            versionId: version.versionId,
            success: true,
        },
    });

    const buildRunning = await prisma.aurPackageBuild.findFirst({
        where: {
            package: {
                name: job.data.packageName,
            },
            versionId: version.versionId,
            running: true,
        },
    });

    const aurDependencies = await prisma.aurDependency.findMany({
        where: {
            package: {
                name: job.data.packageName,
            },
            isAur: true,
        },
    });

    if (existingSuccessfulBuild && !job.data.force) {
        done(new Error('Build already exists'));
        return;
    }

    if (buildRunning) {
        done(new Error('Build is already running'));
        return;
    }

    const unixMillis = new Date().getTime();
    const buildId = `${job.data.packageName}-${version.gitHash}-${unixMillis}`;

    try {
        const prepareSuccessful = await prepareBuild(buildId);

        if (!prepareSuccessful) {
            done(new Error('Failed to prepare build'));
            return;
        }
    } catch (e) {
        done(e as Error);
        return;
    }

    const listOfNotBuildPackages = await dependenciesNotBuilt(aurDependencies.map((dep) => stripPkgName(dep.packageName)));

    if (listOfNotBuildPackages.length > 0) {
        done(new Error(`Missing dependencies: ${listOfNotBuildPackages.join(', ')}`));
        return;
    }

    const gnupgKeysNotAccepted = await prisma.gnupgKeys.findMany({
        where: {
            package: {
                name: job.data.packageName,
            },
            accepted: false,
        },
    });

    if (gnupgKeysNotAccepted.length > 0) {
        done(new Error('There are still non-accepted GPG keys'));
        return;
    }

    const handleError = async (e: Error | unknown): Promise<void> => {
        console.error('Failed to build package', e);
        if (e instanceof Error) {
            const wasLockError = e instanceof ProcessLockTimeoutError;

            if ((e as { code?: number }).code) {
                const { code } = (e as unknown as { code: number | string });

                try {
                    if (wasLockError) {
                        await prisma.aurPackageBuild.delete({
                            where: {
                                id: buildId,
                            },
                        });
                    } else if (typeof code === 'number') {
                        await prisma.aurPackageBuild.update({
                            where: {
                                id: buildId,
                            },
                            data: {
                                running: false,
                                success: false,
                                exitCode: (e as unknown as { code: number }).code,
                                finishedAt: new Date(),
                                failReason: e.message,
                            },
                        });
                    }
                } catch (e2) {
                    console.error('Failed to update build status', e2);
                }
            }

            done(e);
        } else {
            done(new Error('Unknown error'));
        }
    };

    let exitCode: number | undefined;
    let artifacts: string[] = [];

    try {
        const result = await prisma.aurPackageBuild.create({
            data: {
                id: buildId,
                logFile: getBuildLogPath(buildId),
                running: true,
                success: false,
                package: {
                    connect: {
                        name: job.data.packageName,
                    },
                },
                version: {
                    connect: {
                        versionId: version.versionId,
                    },
                },
                startedAt: new Date(),
                taskJobId: String(job.id),
                taskPid: null,
            },
            include: {
                package: {
                    select: {
                        packageId: true,
                    },
                },
            },
        });

        exitCode = await executeBuild(job.data.packageName, result.package.packageId, version.gitHash, buildId, async (pid) => {
            await prisma.aurPackageBuild.update({
                where: {
                    id: buildId,
                },
                data: {
                    taskPid: pid,
                },
            });
        });

        artifacts = await scanForArtifacts(job.data.packageName);

        if (artifacts.length === 0) {
            done(new Error('No artifacts found'));
            return;
        }
    } catch (e) {
        console.error('Failed to build package', e);
        await handleError(e);

        return;
    }

    try {
        for await (const artifact of artifacts) {
            const toPath = getPackagePath(job.data.packageName);
            const toSigPath = getPackageSigPath(job.data.packageName);

            await signArtifact(artifact);

            await fs.rename(artifact, toPath);
            await appendToBuildLog(buildId, `Moved ${artifact} to ${toPath}`);
            await fs.rename(`${artifact}.sig`, toSigPath);
            await appendToBuildLog(buildId, `Moved ${artifact}.sig to ${toSigPath}`);

            await addPackage(toPath);
            await signDatabase(repoDb);
            await signDatabase(repoDbFile);
        }

        // build was successful
        await prisma.aurPackageBuild.update({
            where: {
                id: buildId,
            },
            data: {
                running: false,
                success: true,
                finishedAt: new Date(),
                exitCode,
            },
        });

        await appendToBuildLog(buildId, 'Build successful');

        taskQueue.add('buildAllPackages', {});

        done();
    } catch (e) {
        await handleError(e);

        return;
    }

    done();
};

export default buildPackage;
