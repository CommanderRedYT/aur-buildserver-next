'use client';

import { Inter } from 'next/font/google';

import { createTheme } from '@mui/material';
import type { ThemeOptions } from '@mui/material/styles/createTheme';

export const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
});

const colorTheme = createTheme({
    palette: {
        mode: 'light',
        grey: {
            50: '#f9fafb',
            100: '#f4f5f7',
            200: '#e5e7eb',
            300: '#d2d6dc',
            400: '#9fa6b2',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#252f3f',
            900: '#161e2e',
            A100: '#c1d1f2',
            A200: '#9ab6e1',
            A400: '#678fcd',
            A700: '#4d7ac5',
        },
    },
});

const componentsTheme = createTheme(colorTheme, {
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 24,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    whiteSpace: 'normal',
                },
            },
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    justifyContent: 'flex-end',
                },
            },
        },
        // filled input field should have bigger radius
        MuiTextField: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...(ownerState.variant === 'filled'
                        ? {
                              '& .MuiInputBase-root': {
                                  borderTopLeftRadius: 12,
                                  borderTopRightRadius: 12,
                                  backgroundColor:
                                      theme.palette.background.paper,
                                  // active
                                  '&.Mui-focused': {
                                      backgroundColor:
                                          theme.palette.background.paper,
                                  },
                                  // hover
                                  '&:hover': {
                                      backgroundColor:
                                          theme.palette.background.paper,
                                  },
                              },
                          }
                        : {}),
                }),
            },
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiToggleButton-root': {
                        borderRadius: 12,
                        backgroundColor: theme.palette.background.paper,
                        border: 'none',
                    },
                    '& .MuiToggleButtonGroup-firstButton, .MuiToggleButtonGroup-middleButton':
                        {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                    '& .MuiToggleButtonGroup-lastButton, .MuiToggleButtonGroup-middleButton':
                        {
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        },
                }),
            },
        },
        MuiModal: {
            styleOverrides: {
                // create proper Material 3 modal
                root: {
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                },
            },
        },
    },
} as ThemeOptions);

const baseTheme = createTheme(componentsTheme, {
    direction: 'ltr',
    typography: {
        fontFamily: inter.style.fontFamily,
        /* h1: {
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: inter.style.fontFamily,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: inter.style.fontFamily,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: inter.style.fontFamily,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: inter.style.fontFamily,
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: inter.style.fontFamily,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: inter.style.fontFamily,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
            fontFamily: inter.style.fontFamily,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
            fontFamily: inter.style.fontFamily,
        },
        button: {
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.5,
            fontFamily: inter.style.fontFamily,
            textTransform: 'none',
        },
        caption: {
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.5,
            fontFamily: inter.style.fontFamily,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.5,
            fontFamily: inter.style.fontFamily,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 700,
            lineHeight: 1.5,
            fontFamily: inter.style.fontFamily,
        }, */
    },
});

export default baseTheme;
