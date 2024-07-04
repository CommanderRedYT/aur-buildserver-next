import type { FC } from 'react';

import KnownPackagesList from '@/app/(main)/packages/_components/KnownPackagesList';

import backendFetcherApi from '@/lib/fetcher';

import { Box, Typography } from '@mui/material';

const knownPackagesEndpoint = backendFetcherApi('/api/packages/list')
    .method('get')
    .create();

export type KnownPackagesDataItem = Awaited<
    ReturnType<typeof knownPackagesEndpoint>
>['data']['data'][0];

export type KnownPackagesData =
    | Awaited<ReturnType<typeof knownPackagesEndpoint>>['data']['data']
    | null;

const getKnownPackages = async (): Promise<KnownPackagesData> => {
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
        return null;
    }

    return knownPackages.data.data;
};

const KnownPackagesPage: FC = async () => {
    const knownPackagesData = await getKnownPackages();

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
            <KnownPackagesList knownPackagesData={knownPackagesData} />
        </Box>
    );
};

export default KnownPackagesPage;
