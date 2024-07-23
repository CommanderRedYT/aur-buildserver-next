import type { Request, Response } from 'express';

import { prisma } from '@/database/db';
import { errorResponse, requireBodyParams, successResponse } from '@/helper/api';
import { trustGpgKey } from '@/pacman/build';

const requiredParams = ['keyId'] as const;

export default async function trustKey(req: Request, res: Response): Promise<void> {
    const params = requireBodyParams(requiredParams)(req, res);

    if (!params) {
        return;
    }

    try {
        await trustGpgKey(params.keyId);

        await prisma.gnupgKeys.updateMany({
            where: {
                keyId: params.keyId,
            },
            data: {
                accepted: true,
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            errorResponse(res, 500, e.message);

            return;
        }

        errorResponse(res, 500);
    }

    successResponse(res);
}
