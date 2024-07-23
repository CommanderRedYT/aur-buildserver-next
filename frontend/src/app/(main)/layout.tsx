'use client';

import type { FC, PropsWithChildren } from 'react';
import { useState } from 'react';

import { SnackbarProvider } from 'notistack';

import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const MainWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.vars.palette.grey[200],
    ...theme.applyStyles('dark', {
        backgroundColor: theme.vars.palette.grey[900],
    }),
}));

const PageWrapper = styled('div')({
    display: 'flex',
    flexGrow: 1,
    paddingBottom: '64px',
    flexDirection: 'column',
    zIndex: 1,
    backgroundColor: 'transparent',
    width: '100%',
});

const RootLayout: FC<PropsWithChildren> = props => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
        useState<boolean>(false);

    return (
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            autoHideDuration={3500}
        >
            <MainWrapper className="main-wrapper">
                <Sidebar
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    onSidebarClose={() => setIsMobileSidebarOpen(false)}
                />
                <PageWrapper className="page-wrapper">
                    <Header
                        toggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    />
                    <Container
                        sx={{
                            paddingTop: 2,
                            minHeight: 'calc(100% - 16px)',
                        }}
                        maxWidth="xl"
                    >
                        <Box
                            height="100%"
                            width="100%"
                            display="flex"
                            flexDirection="column"
                        >
                            {props.children}
                        </Box>
                    </Container>
                </PageWrapper>
            </MainWrapper>
        </SnackbarProvider>
    );
};

export default RootLayout;
