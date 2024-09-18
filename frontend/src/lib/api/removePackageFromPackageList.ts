import type { KnownPackagesDataItem } from '@/lib/api/getKnownPackages';
import backendFetcherApi from '@/lib/fetcher';

export type AddPackageToPackageList = (
    data: KnownPackagesDataItem,
) => Promise<void>;

const removePackageEndpoint = backendFetcherApi('/api/packages/remove')
    .method('post')
    .create();

const removePackageFromPackageList: AddPackageToPackageList = async data => {
    if (!data?.id) {
        throw new Error('No id provided to removePackageFromPackageList');
    }

    const response = await removePackageEndpoint({
        id: data.id,
    });

    if (!response.ok || !response.data.success) {
        if ('error' in response.data) {
            throw new Error(response.data.error as string);
        } else {
            throw new Error('Error removing package from database');
        }
    }
};

export default removePackageFromPackageList;
