import type { FC } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, styled, Toolbar } from '@mui/material';

export interface HeaderProps {
    toggleMobileSidebar: () => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
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
    <StyledAppBar position="sticky">
        <StyledToolbar>
            <IconButton
                color="inherit"
                onClick={toggleMobileSidebar}
                sx={{ display: { lg: 'none', xs: 'flex' } }}
            >
                <MenuIcon />
            </IconButton>
        </StyledToolbar>
    </StyledAppBar>
);

export default Header;
