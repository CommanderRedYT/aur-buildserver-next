import type { FC } from 'react';

import KnownPackageList from '@/content/KnownPackagesPage/KnownPackagesList';
import backendFetcherApi from '@/lib/fetcher';

import { Box, Typography } from '@mui/material';

const knownPackagesEndpoint = backendFetcherApi('/api/packages/list')
    .method('get')
    .create();

export type KnownPackages =
    | Awaited<ReturnType<typeof knownPackagesEndpoint>>['data']['data']
    | null;

const getKnownPackages = async (): Promise<KnownPackages> => {
    const knownPackages = await knownPackagesEndpoint(
        {},
        {
            cache: 'no-cache',
        },
    );

    const {
        data: { success },
    } = knownPackages;

    if (!success) {
        return null;
    }

    return knownPackages.data.data;
};

const KnownPackagesPage: FC = async () => {
    const data = await getKnownPackages();

    if (!data) {
        return (
            <Typography variant="h4">Failed to fetch known packages</Typography>
        );
    }

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Box
                display="flex"
                width="100%"
                paddingY={1}
                flexDirection="column"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h4">Packages</Typography>
            </Box>
            <KnownPackageList knownPackages={data} />
        </Box>
    );
};

export default KnownPackagesPage;
