import type { Request, Response } from 'express';

import { Prisma } from '@prisma/client';

import fetcherApi from '@/aur/fetcher';
import listKnownPackages from '@/database/listKnownPackages';
import { errorResponse, requirePathParams, successResponse } from '@/helper/api';

const requiredParams = ['packageName'] as const;

export default async function searchPackage(req: Request, res: Response): Promise<void> {
    const params = requirePathParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from path');
        return;
    }

    const searchEndpoint = fetcherApi('/rpc/v5/search/{arg}').method('get').create();

    try {
        const response = await searchEndpoint({
            arg: params.packageName,
            by: 'name-desc',
        });

        const knownPackages = await listKnownPackages();

        const fetchedData = {
            ...response.data,
            knownPackages,
        };

        successResponse<'/api/aur/search/{packageName}'>(res, fetchedData);
    } catch (e) {
        console.error('searchPage error', e);

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            errorResponse(res, 500, e.message);
        } else if (e instanceof searchEndpoint.Error) {
            const error = e.getActualType();

            errorResponse(res, 500, error.data.error);
        } else {
            errorResponse(res, 500);
        }
    }
}
