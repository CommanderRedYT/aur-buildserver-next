'use client';

import { useRouter } from 'next/navigation';

import type { FC } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const NotFoundPage: FC = () => {
    const router = useRouter();

    return (
        <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            height="100%"
            gap={5}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
            >
                <Typography variant="h3">
                    This page could not be found
                </Typography>
                <Typography variant="h6">
                    Please check the URL and try again
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/')}
            >
                Go back to the home page
            </Button>
        </Box>
    );
};

export default NotFoundPage;
