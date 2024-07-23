import type { Request, Response } from 'express';

import { prisma } from '@/database/db';
import type { components } from '@/generated/backend';
import { successResponse } from '@/helper/api';

export default async function listBuilds(req: Request, res: Response): Promise<void> {
    const builds = await prisma.aurPackageBuild.findMany({
        orderBy: [
            {
                startedAt: 'desc',
            },
            {
                finishedAt: 'desc',
            },
        ],
        include: {
            version: {
                select: {
                    pkgver: true,
                    pkgrel: true,
                    gitHash: true,
                },
            },
            package: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
    });

    const transformedBuild: components['schemas']['BuildFromDatabase'][] = builds.map((build) => ({
        id: build.id,
        running: build.running,
        success: build.success,
        exitCode: build.exitCode,
        startedAt: build.startedAt.toISOString(),
        finishedAt: build.finishedAt?.toISOString() ?? null,
        package: build.package,
        version: build.version,
    }));

    successResponse<'/api/builds/list'>(res, transformedBuild);
}
