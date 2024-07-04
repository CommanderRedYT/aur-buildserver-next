import type { Request, Response } from 'express';

import { Prisma } from '@prisma/client';

import listKnownPackages from '@/database/listKnownPackages';
import { errorResponse, successResponse } from '@/helper/api';

export default async function listPackages(_: Request, res: Response): Promise<void> {
    try {
        const packages = await listKnownPackages();

        successResponse<'/api/packages/list'>(res, packages, { canCache: false });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                errorResponse(res, 409, 'Package already exists');
                return;
            }

            errorResponse(res, 500, e.message);
        } else {
            errorResponse(res, 500);
        }
    }
}
