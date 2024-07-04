import type { Metadata } from 'next';

import type { FC } from 'react';
import React from 'react';

import theme from '@/lib/theme';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export interface RootLayoutProps {
    children: React.ReactNode;
    params?: {
        tag: string;
        item: string;
    };
}

export const metadata: Metadata = {
    title: 'AUR Buildserver Next',
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
    <html lang="en">
        <body>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </AppRouterCacheProvider>
        </body>
    </html>
);

export default RootLayout;
