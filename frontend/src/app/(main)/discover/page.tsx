import type { FC } from 'react';

import DiscoverPackageContent from '@/app/(main)/discover/_components/DiscoverPackageContent';

import { Box, Typography } from '@mui/material';

const DiscoverPackagesPage: FC = () => (
    <Box display="flex" flexDirection="column" flex={1}>
        <Box
            display="flex"
            width="100%"
            paddingY={1}
            flexDirection="column"
            alignItems="center"
            mb={2}
        >
            <Typography variant="h4">Discover AUR packages</Typography>
        </Box>
        <DiscoverPackageContent />
    </Box>
);

export default DiscoverPackagesPage;
