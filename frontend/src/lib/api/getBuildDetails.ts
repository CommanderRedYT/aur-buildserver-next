import type { PageFetchType } from '@/types';

import backendFetcherApi from '@/lib/fetcher';

const listBuildDetailsEndpoint = backendFetcherApi(
    '/api/builds/details/{buildId}',
)
    .method('get')
    .create();

export type BuildDetailsData =
    | Awaited<ReturnType<typeof listBuildDetailsEndpoint>>['data']['data']
    | null;

const getBuildDetails = async (
    buildId: string,
): Promise<PageFetchType<BuildDetailsData>> => {
    try {
        const knownPackages = await listBuildDetailsEndpoint(
            {
                buildId,
            },
            {
                cache: 'no-store',
            },
        );

        if (
            !knownPackages ||
            !knownPackages.ok ||
            !knownPackages.data ||
            !knownPackages.data.success ||
            !knownPackages.data.data
        ) {
            return [null, { error: 'Failed to fetch build details' }];
        }

        return [knownPackages.data.data, null];
    } catch (e) {
        console.error('Failed to fetch build details', e);
        return [
            null,
            {
                error: e,
            },
        ];
    }
};

export default getBuildDetails;
