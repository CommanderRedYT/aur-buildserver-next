import type { FC } from 'react';

import UsageContent from '@/app/(main)/usage/_components/UsageContent';

import fetchInfo from '@/lib/api/fetchInfo';
import type { FetchInfoReturnType } from '@/lib/fetcher';

import Box from '@mui/material/Box';

export const infoFetcher = async (): Promise<FetchInfoReturnType> =>
    fetchInfo();

const UsagePage: FC = async () => {
    const info = await infoFetcher();

    return (
        <Box
            display="flex"
            flexDirection="column"
            flex={1}
            style={{ overflowX: 'auto' }}
        >
            <UsageContent {...info} />
        </Box>
    );
};

export default UsagePage;
