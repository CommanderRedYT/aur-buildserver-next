import type { TypeOfArrayItem } from '@/types';

import type {
    FetchDetailedReturnType,
    SearchPackageReturnType,
} from '@/lib/fetcher';
import backendFetcherApi from '@/lib/fetcher';

export type FetchDetailedPackage = (
    pkg: TypeOfArrayItem<SearchPackageReturnType['results']>,
) => Promise<FetchDetailedReturnType>;

const fetchDetailedEndpoint = backendFetcherApi(
    '/api/aur/fetchDetailed/{packageName}',
)
    .method('get')
    .create();

const fetchDetailedPackage: FetchDetailedPackage = async pkg => {
    if (!pkg?.Name) {
        throw new Error('No name provided to fetchDetailedPackage');
    }

    const response = await fetchDetailedEndpoint({
        packageName: pkg.Name,
    });

    if (!response.ok || !response.data.success || !response.data.data) {
        if ('error' in response.data) {
            throw new Error(response.data.error as string);
        } else {
            throw new Error('Failed to fetch detailed package data');
        }
    }

    return response.data.data;
};

export default fetchDetailedPackage;
