import type { Metadata, Viewport } from 'next';

import type { FC } from 'react';
import React from 'react';

import theme from '@/lib/theme';

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
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

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
    <html lang="en" suppressHydrationWarning>
        <body>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <InitColorSchemeScript attribute="class" />
                    <CssBaseline />
                    <main>{children}</main>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </body>
    </html>
);

export default RootLayout;
