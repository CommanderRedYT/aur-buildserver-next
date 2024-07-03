import { usePathname } from 'next/navigation';

import type { FC } from 'react';

import NavGroup from '@/components/layout/Sidebar/NavGroup';
import NavItem from '@/components/layout/Sidebar/NavItem';

import MenuItems from '@/constants/sidebar';

import { List } from '@mui/material';

export interface SidebarItemsProps {
    toggleMobileSidebar: () => void;
}

const SidebarItems: FC<SidebarItemsProps> = () => {
    const pathname = usePathname();

    return (
        <List sx={{ pt: 0 }} className="sidebarNav" component="div">
            {MenuItems.map(item => {
                if ('subheader' in item) {
                    return (
                        <NavGroup item={item} key={`navgroup-${item.key}`} />
                    );
                }
                return (
                    <NavItem
                        item={item}
                        key={`navitem-${item.key}`}
                        pathname={pathname}
                    />
                );
            })}
        </List>
    );
};

export default SidebarItems;
