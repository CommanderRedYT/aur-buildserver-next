import type { FC } from 'react';

import BuildList from '@/app/(main)/builds/_components/BuildList';

import getBuilds from '@/lib/api/getBuilds';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BuildsPage: FC = async () => {
    const [buildsData] = await getBuilds();

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
                <Typography variant="h4">Builds</Typography>
            </Box>
            <BuildList initialBuildsData={buildsData} />
        </Box>
    );
};

export default BuildsPage;
