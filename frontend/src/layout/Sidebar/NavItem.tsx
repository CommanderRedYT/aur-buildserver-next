import Link from 'next/link';

import type { FC } from 'react';

import type { MenuItem } from '@/constants/sidebar';
import important from '@/lib/important';

import { alpha, useTheme } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export interface NavItemProps {
    item: MenuItem;
    pathname: string;
    onClick?: () => void;
}

const t = (key: string): string => key;

const NavItem: FC<NavItemProps> = ({ item, pathname, onClick }) => {
    const theme = useTheme();
    return (
        <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <ListItemButton
                component={Link}
                href={item.href}
                disabled={item.disabled}
                selected={item.href === pathname}
                target={item.external ? '_blank' : ''}
                onClick={onClick}
                sx={{
                    // stupid hack
                    borderRadius: 8,
                    padding: theme.spacing(1, 2),
                    backgroundColor:
                        item.href === pathname
                            ? important(theme.vars.palette.common.black)
                            : 'transparent',
                    color:
                        item.href === pathname
                            ? important(theme.vars.palette.common.white)
                            : 'inherit',
                    '& .MuiListItemIcon-root': {
                        color:
                            item.href === pathname
                                ? important(theme.vars.palette.common.white)
                                : 'inherit',
                    },
                    opacity: item.disabled ? 0.5 : 1,
                    '&:hover': {
                        ...(item.href === pathname
                            ? {
                                  opacity: 0.8,
                              }
                            : {
                                  backgroundColor: alpha(
                                      theme.palette.common.black,
                                      0.1,
                                  ),
                              }),
                    },
                    ...theme.applyStyles('dark', {
                        backgroundColor:
                            item.href === pathname
                                ? important(theme.vars.palette.common.white)
                                : 'transparent',
                        color:
                            item.href === pathname
                                ? important(theme.vars.palette.common.black)
                                : 'inherit',
                        '& .MuiListItemIcon-root': {
                            color:
                                item.href === pathname
                                    ? important(theme.vars.palette.common.black)
                                    : 'inherit',
                        },
                        '&:hover': {
                            ...(item.href === pathname
                                ? {
                                      opacity: 0.8,
                                  }
                                : {
                                      backgroundColor: alpha(
                                          theme.palette.common.white,
                                          0.1,
                                      ),
                                  }),
                        },
                    }),
                    transition: theme.transitions.create(
                        ['background-color', 'color', 'opacity', 'background'],
                        {
                            duration: theme.transitions.duration.standard,
                        },
                    ),
                }}
            >
                {item.Icon ? (
                    <ListItemIcon>
                        <item.Icon />
                    </ListItemIcon>
                ) : null}
                <ListItemText>{item.title(t)}</ListItemText>
            </ListItemButton>
        </ListItem>
    );
};

export default NavItem;
