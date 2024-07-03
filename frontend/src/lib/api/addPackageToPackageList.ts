import type { TypeOfArrayItem } from '@/types';

import type { SearchPackageReturnType } from '@/lib/fetcher';
import backendFetcherApi from '@/lib/fetcher';

export type AddPackageToPackageList = (
    pkg: TypeOfArrayItem<SearchPackageReturnType['results']>,
) => Promise<void>;

const addPackageEndpoint = backendFetcherApi('/api/packages/add')
    .method('post')
    .create();

const addPackageToPackageList: AddPackageToPackageList = async pkg => {
    if (!pkg?.Name) {
        throw new Error('No name provided to addPackageToPackageList');
    }

    const response = await addPackageEndpoint({
        name: pkg.Name,
    });

    if (!response.ok || !response.data.success) {
        if ('error' in response.data) {
            throw new Error(response.data.error as string);
        } else {
            throw new Error('Error adding package to database');
        }
    }
};

export default addPackageToPackageList;
