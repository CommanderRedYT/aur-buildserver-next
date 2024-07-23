import type { PageFetchType } from '@/types';

import backendFetcherApi from '@/lib/fetcher';

const knownPackagesEndpoint = backendFetcherApi('/api/packages/list')
    .method('get')
    .create();

export type KnownPackagesDataItem = Awaited<
    ReturnType<typeof knownPackagesEndpoint>
>['data']['data'][0];

export type KnownPackagesData =
    | Awaited<ReturnType<typeof knownPackagesEndpoint>>['data']['data']
    | null;

const getKnownPackages = async (): Promise<
    PageFetchType<KnownPackagesData>
> => {
    try {
        const knownPackages = await knownPackagesEndpoint(
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
            return [null, { error: 'Failed to fetch known packages' }];
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

export default getKnownPackages;
