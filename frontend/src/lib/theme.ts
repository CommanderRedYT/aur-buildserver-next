'use client';

import { Inter } from 'next/font/google';

import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

export const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
});

const customTheme = extendTheme({
    direction: 'ltr',
    typography: {
        fontFamily: inter.style.fontFamily,
    },
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
                                      theme.vars.palette.background.paper,
                                  // active
                                  '&.Mui-focused': {
                                      backgroundColor:
                                          theme.vars.palette.background.paper,
                                  },
                                  // hover
                                  '&:hover': {
                                      backgroundColor:
                                          theme.vars.palette.background.paper,
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
                        backgroundColor: theme.vars.palette.background.paper,
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
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default customTheme;
