import type { OpReturnType } from 'openapi-typescript-fetch';
import { Fetcher } from 'openapi-typescript-fetch';

import type { paths } from '@/generated/backend';

// declare fetcher for paths
const fetcher = Fetcher.for<paths>();

if (typeof window === 'undefined') {
    fetcher.configure({
        baseUrl: process.env.CONFIG_API_URL,
    });
}

const backendFetcherApi = fetcher.path;

export default backendFetcherApi;

export type SearchPackageReturnType = Required<
    OpReturnType<paths['/api/aur/search/{packageName}']['get']>
>['data'];

export type FetchPkgbuildReturnType = Required<
    OpReturnType<paths['/api/aur/fetchPkgbuild/{packageName}']['get']>
>['data'];

export type FetchDetailedReturnType = Required<
    OpReturnType<paths['/api/aur/fetchDetailed/{packageName}']['get']>
>['data'];

export type FetchInfoReturnType = Required<
    OpReturnType<paths['/api/info']['get']>
>['data'];
