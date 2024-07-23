import type { PageFetchType } from '@/types';

import backendFetcherApi from '@/lib/fetcher';

const listGnupgIssuesEndpoint = backendFetcherApi('/api/gnupg/list')
    .method('get')
    .create();

export type GnupgDataItem = Awaited<
    ReturnType<typeof listGnupgIssuesEndpoint>
>['data']['data'][0];

export type GnupgData =
    | Awaited<ReturnType<typeof listGnupgIssuesEndpoint>>['data']['data']
    | null;

const listGnupgIssues = async (): Promise<PageFetchType<GnupgData>> => {
    try {
        const knownPackages = await listGnupgIssuesEndpoint(
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
            return [null, { error: 'Failed to fetch gnupg issues' }];
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

export default listGnupgIssues;
