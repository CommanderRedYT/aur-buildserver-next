import type { Request, Response } from 'express';

import { getPkgbuildUrl } from '@/aur/constants';
import cache from '@/cache';
import { errorResponse, requirePathParams, successResponse } from '@/helper/api';

const requiredParams = ['packageName'] as const;

export default async function fetchPkgbuild(req: Request, res: Response): Promise<void> {
    const params = requirePathParams(requiredParams)(req, res);

    if (!params) {
        errorResponse(res, 400, 'Missing parameter from path');
        return;
    }

    try {
        const response = await cache(async () => {
            const pkgbuild = await fetch(getPkgbuildUrl(params.packageName));

            if (!pkgbuild.ok) {
                throw new Error('Failed to fetch PKGBUILD');
            }

            return pkgbuild.text();
        }, {
            // 1 hour
            ttl: 1000 * 60 * 60,
            cacheKey: `pkgbuild-${params.packageName}`,
        });

        successResponse<'/api/aur/fetchPkgbuild/{packageName}'>(res, response);
    } catch (e) {
        console.error('fetchPkgbuild error', e);

        errorResponse(res, 500);
    }
}
