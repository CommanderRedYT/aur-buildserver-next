import type { Metadata, Viewport } from 'next';

import type { FC } from 'react';
import React from 'react';

import theme from '@/lib/theme';

import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
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
    <html lang="en">
        <body>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <CssVarsProvider defaultMode="system" theme={theme}>
                    <InitColorSchemeScript />
                    <CssBaseline />
                    <main>{children}</main>
                </CssVarsProvider>
            </AppRouterCacheProvider>
        </body>
    </html>
);

export default RootLayout;
