import type { FC } from 'react';

import type { SubheaderMenuItem } from '@/constants/sidebar';

import { styled } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';

export interface NavGroupProps {
    item: SubheaderMenuItem;
}

const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
    ...theme.typography.overline,
    fontWeight: theme.typography.fontWeightBold,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0),
    color: theme.palette.text.primary,
    lineHeight: '1.5',
    padding: theme.spacing(1, 3),
}));

const t = (key: string): string => key;

const NavGroup: FC<NavGroupProps> = ({ item }) => (
    <StyledListSubheader disableSticky>{item.subheader(t)}</StyledListSubheader>
);

export default NavGroup;
