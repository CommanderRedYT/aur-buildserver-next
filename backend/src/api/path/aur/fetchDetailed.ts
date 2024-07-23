import type { Request, Response } from 'express';

import fetcherApi from '@/aur/fetcher';
import type { ApiResponseType } from '@/helper/api';
import { errorResponse, requirePathParams, successResponse } from '@/helper/api';
import { getAurOnlyDependenciesFromMultiplePackageDetailed } from '@/helper/aur';

const requiredParams = ['packageName'] as const;

const packageEndpoint = fetcherApi('/rpc/v5/info/{arg}').method('get').create();

export default async function fetchDetailed(req: Request, res: Response): Promise<void> {
    const params = requirePathParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from path');
        return;
    }

    try {
        const packageData = await packageEndpoint({
            arg: params.packageName,
        });

        if (!packageData.ok) {
            throw new Error('Failed to fetch detailed info');
        }

        const aurPackages = await getAurOnlyDependenciesFromMultiplePackageDetailed(packageData.data.results);

        const data: ApiResponseType<'/api/aur/fetchDetailed/{packageName}'> = {
            ...packageData.data,
            aurPackages,
        };

        successResponse<'/api/aur/fetchDetailed/{packageName}'>(res, data);
    } catch (e) {
        console.error('fetchPkgbuild error', e);

        errorResponse(res, 500);
    }
}
