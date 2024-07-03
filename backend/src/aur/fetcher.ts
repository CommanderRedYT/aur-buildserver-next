import { Fetcher } from 'openapi-typescript-fetch';

import type { paths } from '@/generated/aur';

// declare fetcher for paths
const fetcher = Fetcher.for<paths>();

// global configuration
fetcher.configure({
    baseUrl: 'https://aur.archlinux.org/',
});

const fetcherApi = fetcher.path;

export default fetcherApi;
