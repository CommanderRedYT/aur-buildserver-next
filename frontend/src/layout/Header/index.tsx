import type { FC } from 'react';
import React from 'react';

import ThemeModeSwitcher from '@/components/ThemeModeSwitcher';

import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

export interface HeaderProps {
    toggleMobileSidebar: () => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    backgroundColor: theme.vars.palette.background.paper,
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
        minHeight: 64,
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
}));

const Header: FC<HeaderProps> = ({ toggleMobileSidebar }) => (
    <>
        <StyledAppBar position="sticky" color="transparent">
            <StyledToolbar>
                <IconButton
                    color="inherit"
                    onClick={toggleMobileSidebar}
                    sx={{ display: { lg: 'none', xs: 'flex' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box
                    ml="auto"
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                >
                    <ThemeModeSwitcher />
                </Box>
            </StyledToolbar>
        </StyledAppBar>
    </>
);

export default Header;
