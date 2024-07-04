import { usePathname } from 'next/navigation';

import type { FC } from 'react';

import MenuItems from '@/constants/sidebar';
import NavGroup from '@/layout/Sidebar/NavGroup';
import NavItem from '@/layout/Sidebar/NavItem';

import { List } from '@mui/material';

const SidebarItems: FC = () => {
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
