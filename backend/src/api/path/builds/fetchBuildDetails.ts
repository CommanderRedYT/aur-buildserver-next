import type { Request, Response } from 'express';
import fs from 'fs/promises';

import { prisma } from '@/database/db';
import type { components } from '@/generated/backend';
import { errorResponse, requirePathParams, successResponse } from '@/helper/api';

const requiredParams = ['id'] as const;

export default async function fetchBuildDetails(req: Request, res: Response): Promise<void> {
    const params = requirePathParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from path');
        return;
    }

    const { id } = params;

    const result = await prisma.aurPackageBuild.findUnique({
        where: {
            id,
        },
        select: {
            logFile: true,
            success: true,
            startedAt: true,
            finishedAt: true,
            running: true,
            exitCode: true,
            version: {
                select: {
                    pkgver: true,
                    pkgrel: true,
                    gitHash: true,
                },
            },
        },
    });

    if (!result) {
        errorResponse(res, 404, 'Build not found');
        return;
    }

    const { logFile } = result;

    let logFileContents: components['schemas']['LogFile'] | undefined;

    try {
        logFileContents = await fs.readFile(logFile, 'utf-8');
    } catch (e) {
        console.error('fetchLogfile error', e);
        // if file does not exist, continue
        if ((e as { code: string; }).code !== 'ENOENT') {
            errorResponse(res, 500);
            return;
        }
    }

    const transformedResult: components['schemas']['LogFileResponse'] = {
        ...result,
        logFileContents,
        startedAt: result.startedAt.toISOString(),
        finishedAt: result.finishedAt?.toISOString() ?? null,
    };

    successResponse<'/api/builds/details/{buildId}'>(res, transformedResult);
}
