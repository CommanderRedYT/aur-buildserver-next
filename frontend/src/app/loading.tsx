import type { FC } from 'react';

import UndrawLoading from '@public/undraw/loading.svg';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LoadingLayout: FC = () => (
    <Box height="100%" width="100%" margin="auto" display="flex" maxHeight="100vh">
        <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            gap={2}
            alignItems="center"
            flex={1}
        >
            <Typography variant="h2" align="center">
                Loading...
            </Typography>
            <UndrawLoading height="50%" width="50%" />
        </Box>
    </Box>
);

export default LoadingLayout;
