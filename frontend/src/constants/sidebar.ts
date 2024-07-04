import type { Route } from 'next';

import type { SvgIconComponent } from '@mui/icons-material';
import AppsIcon from '@mui/icons-material/Apps';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DashboardIcon from '@mui/icons-material/Dashboard';

export interface SubheaderMenuItem {
    key: string;
    subheader: (t: (key: string) => string) => string;
}

export interface MenuItem {
    key: string;
    title: (t: (key: string) => string) => string;
    href: Route;
    disabled?: boolean;
    external?: boolean;
    Icon?: SvgIconComponent;
}

export type MenuItemsType = (MenuItem | SubheaderMenuItem)[];

const MenuItems: MenuItemsType = [
    {
        key: 'home',
        subheader: t => t('Home'),
    },
    {
        key: 'dashboard',
        title: t => t('Dashboard'),
        href: '/',
        Icon: DashboardIcon,
    },
    {
        key: 'packages',
        title: t => t('Packages'),
        href: '/packages',
        Icon: BookmarkIcon,
    },
    {
        key: 'discover',
        subheader: t => t('Discover'),
    },
    {
        key: 'discover',
        title: t => t('Discover packages'),
        href: '/discover',
        Icon: AppsIcon,
    },
];

export default MenuItems;
