import type { FetchInfoReturnType } from '@/lib/fetcher';
import backendFetcherApi from '@/lib/fetcher';

export type FetchInfo = () => Promise<FetchInfoReturnType>;

const fetchInfoEndpoint = backendFetcherApi('/api/info').method('get').create();

const fetchInfo: FetchInfo = async () => {
    const response = await fetchInfoEndpoint({});

    if (!response.ok || !response.data.success) {
        if ('error' in response.data) {
            throw new Error(response.data.error as string);
        } else {
            throw new Error('Error getting info from backend');
        }
    }

    return response.data.data;
};

export default fetchInfo;
