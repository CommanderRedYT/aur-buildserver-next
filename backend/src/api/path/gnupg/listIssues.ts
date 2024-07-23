import type { Request, Response } from 'express';

import { Prisma } from '@prisma/client';

import { prisma } from '@/database/db';
import { errorResponse, successResponse } from '@/helper/api';

export default async function listIssues(_: Request, res: Response): Promise<void> {
    try {
        const gpgIssues = await prisma.gnupgKeys.findMany({
            include: {
                package: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        successResponse<'/api/gnupg/list'>(res, gpgIssues, { canCache: false });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            errorResponse(res, 500, e.message);
        } else {
            errorResponse(res, 500);
        }
    }
}
