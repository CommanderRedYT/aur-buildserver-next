import backendFetcherApi from '@/lib/fetcher';

const trustGpgKeyEndpoint = backendFetcherApi('/api/gnupg/trust')
    .method('post')
    .create();

const trustGpgKey = async (keyId: string): Promise<void> => {
    await trustGpgKeyEndpoint({ keyId });
};

export default trustGpgKey;
