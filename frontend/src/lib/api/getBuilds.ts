import type { PageFetchType } from '@/types';

import backendFetcherApi from '@/lib/fetcher';

const listBuildsEndpoint = backendFetcherApi('/api/builds/list')
    .method('get')
    .create();

export type BuildDataItem = Awaited<
    ReturnType<typeof listBuildsEndpoint>
>['data']['data'][0];

export type BuildsData =
    | Awaited<ReturnType<typeof listBuildsEndpoint>>['data']['data']
    | null;

const getBuilds = async (): Promise<PageFetchType<BuildsData>> => {
    try {
        const knownPackages = await listBuildsEndpoint(
            {},
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
            return [null, { error: 'Failed to fetch builds' }];
        }

        return [knownPackages.data.data, null];
    } catch (e) {
        return [
            null,
            {
                error: e,
            },
        ];
    }
};

export default getBuilds;
