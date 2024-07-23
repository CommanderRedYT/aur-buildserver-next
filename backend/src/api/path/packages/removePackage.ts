import type { Request, Response } from 'express';
import fs from 'fs/promises';

import { Prisma } from '@prisma/client';

import { prisma } from '@/database/db';
import {
    errorResponse, ErrorResponseThrowable, requireBodyParams, successResponse,
} from '@/helper/api';
import exists from '@/helper/exists';
import { getPackageDirectory } from '@/pacman/build';
import taskQueue from '@/taskmanager';

const requiredParams = ['id'] as const;

export default async function addPackage(req: Request, res: Response): Promise<void> {
    const params = requireBodyParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from body');
        return;
    }

    try {
        const handleDeletePackage = async (id: string): Promise<void> => {
            const packageData = await prisma.aurPackage.findUnique({
                where: {
                    id,
                },
                select: {
                    name: true,
                },
            });

            if (!packageData) {
                throw new ErrorResponseThrowable(404, 'Package not found');
            }

            const needsToBeRemovedFirst = await prisma.aurPackage.findMany({
                where: {
                    dependencies: {
                        some: {
                            strippedPackageName: packageData.name,
                        },
                    },
                },
                select: {
                    name: true,
                },
                distinct: ['name'],
            });

            console.log('needsToBeRemovedFirst', needsToBeRemovedFirst);

            if (needsToBeRemovedFirst.length > 0) {
                throw new ErrorResponseThrowable(400, `Dependencies need to be removed first (${needsToBeRemovedFirst.map((i) => i.name).join(', ')})`);
            }

            const builds = await prisma.aurPackageBuild.findMany({
                where: {
                    package: {
                        id,
                    },
                },
                select: {
                    logFile: true,
                    taskJobId: true,
                    taskPid: true,
                },
            });

            const logFiles = builds.map((build) => build.logFile);

            try {
                for await (const build of builds) {
                    console.log('Removing task job', build.taskJobId);
                    await taskQueue.removeJobs(build.taskJobId);
                    if (build.taskPid) {
                        console.log('Killing pid', build.taskPid);
                        process.kill(build.taskPid);
                    }
                }
            } catch (e) {
                console.warn('Failed to remove task job', e);
            }

            await prisma.aurPackage.delete({
                where: {
                    id,
                },
            });

            const directory = getPackageDirectory(packageData.name);

            if (await exists(directory)) {
                await fs.rm(directory, {
                    recursive: true,
                    force: true,
                });
            }

            for await (const logfile of logFiles) {
                await fs.rm(logfile, {
                    recursive: true,
                    force: true,
                });
            }
        };

        await handleDeletePackage(params.id);

        successResponse<'/api/packages/remove'>(res);
    } catch (e) {
        if (e instanceof ErrorResponseThrowable) {
            errorResponse(res, 500, e);
        } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
            errorResponse(res, 500, e.message, undefined, { e });
        } else {
            errorResponse(res, 500, undefined, undefined, {
                e,
            });
        }
    }
}
