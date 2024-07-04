import Link from 'next/link';

import type { FC } from 'react';

import type { MenuItem } from '@/constants/sidebar';

import {
    alpha,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
} from '@mui/material';

export interface NavItemProps {
    item: MenuItem;
    pathname: string;
    onClick?: () => void;
}

const t = (key: string): string => key;

const StyledListItem = styled(ListItem)(({ theme }) => ({
    // material 3 themed
    '&.Mui-selected': {
        backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
        ),
        '& .MuiTouchRipple-child': {
            backgroundColor: alpha(theme.palette.primary.main, 0.6),
        },
    },
    '&.Mui-disabled': {
        color: theme.palette.text.disabled,
    },
    '&:hover': {
        backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.hoverOpacity,
        ),
        '& .MuiTouchRipple-child': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
        },
    },
    paddingTop: 0,
    paddingBottom: 0,
}));

const NavItem: FC<NavItemProps> = ({ item, pathname, onClick }) => (
    <StyledListItem>
        <ListItemButton
            component={Link}
            href={item.href}
            disabled={item.disabled}
            selected={item.href === pathname}
            target={item.external ? '_blank' : ''}
            onClick={onClick}
            sx={{ borderRadius: 8, px: 2 }}
        >
            {item.Icon ? (
                <ListItemIcon>
                    <item.Icon />
                </ListItemIcon>
            ) : null}
            <ListItemText>{item.title(t)}</ListItemText>
        </ListItemButton>
    </StyledListItem>
);

export default NavItem;
