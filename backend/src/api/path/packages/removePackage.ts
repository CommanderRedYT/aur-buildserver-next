import type { Request, Response } from 'express';

import { Prisma } from '@prisma/client';

import { prisma } from '@/database/db';
import { errorResponse, requireBodyParams, successResponse } from '@/helper/api';

const requiredParams = ['id'] as const;

export default async function addPackage(req: Request, res: Response): Promise<void> {
    const params = requireBodyParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from body');
        return;
    }

    try {
        await prisma.aurPackage.delete({
            where: {
                id: params.id,
            },
        });

        successResponse<'/api/packages/remove'>(res);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            /* if (e.code === 'P2002') {
                errorResponse(res, 409, 'Package already exists', undefined, {
                    message: e.message,
                });
                return;
            } */

            errorResponse(res, 500, e.message, undefined, { e });
        } else {
            errorResponse(res, 500, undefined, undefined, {
                e,
            });
        }
    }
}
