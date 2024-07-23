import type { FC } from 'react';

import KnownPackagesList from '@/app/(main)/packages/_components/KnownPackagesList';

import getKnownPackages from '@/lib/api/getKnownPackages';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const KnownPackagesPage: FC = async () => {
    const [knownPackagesData] = await getKnownPackages();

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
