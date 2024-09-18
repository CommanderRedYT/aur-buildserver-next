import type { Route } from 'next';

import type { SvgIconComponent } from '@mui/icons-material';
import AppsIcon from '@mui/icons-material/Apps';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ConstructionIcon from '@mui/icons-material/Construction';
import DashboardIcon from '@mui/icons-material/Dashboard';
// gnupg icon
import GpgIcon from '@mui/icons-material/GppGood';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

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
        key: 'builds',
        title: t => t('Builds'),
        href: '/builds',
        Icon: ConstructionIcon,
    },
    {
        key: 'gnupg',
        title: t => t('GnuPG Keys'),
        href: '/gnupg',
        Icon: GpgIcon,
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
    {
        key: 'usage-and-settings',
        subheader: t => t('Usage and settings'),
    },
    {
        key: 'usage',
        title: t => t('Usage'),
        href: '/usage',
        Icon: InfoIcon,
    },
    {
        key: 'settings',
        title: t => t('Settings'),
        href: '/settings',
        Icon: SettingsIcon,
    },
];

export default MenuItems;
