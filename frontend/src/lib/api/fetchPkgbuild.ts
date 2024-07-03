import type { TypeOfArrayItem } from '@/types';

import type {
    FetchPkgbuildReturnType,
    SearchPackageReturnType,
} from '@/lib/fetcher';
import backendFetcherApi from '@/lib/fetcher';

export type FetchPkgbuild = (
    pkg: TypeOfArrayItem<SearchPackageReturnType['results']>,
) => Promise<FetchPkgbuildReturnType>;

const fetchPkgbuildEndpoint = backendFetcherApi(
    '/api/aur/fetchPkgbuild/{packageName}',
)
    .method('get')
    .create();

const fetchPkgbuild: FetchPkgbuild = async pkg => {
    if (!pkg?.Name) {
        throw new Error('No name provided to fetchPkgbuild');
    }

    const response = await fetchPkgbuildEndpoint({
        packageName: pkg.Name,
    });

    if (!response.ok || !response.data.success || !response.data.data) {
        if ('error' in response.data) {
            throw new Error(response.data.error as string);
        } else {
            throw new Error('Failed to fetch PKGBUILD');
        }
    }

    return response.data.data;
};

export default fetchPkgbuild;
