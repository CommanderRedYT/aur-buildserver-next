import type { FC } from 'react';

import Logo from '@/components/Logo';

import SidebarItems from '@/layout/Sidebar/SidebarItems';

import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

export interface SidebarProps {
    isMobileSidebarOpen: boolean;
    onSidebarClose: () => void;
}

const sidebarWidth = '270px';

const Sidebar: FC<SidebarProps> = ({ onSidebarClose, isMobileSidebarOpen }) => {
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    if (lgUp) {
        return (
            <Box
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                }}
            >
                <Drawer
                    anchor="left"
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: sidebarWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Box sx={{ height: '100%' }}>
                        <Box px={3}>
                            <Logo />
                        </Box>
                        <Box>
                            <SidebarItems />
                        </Box>
                    </Box>
                </Drawer>
            </Box>
        );
    }

    return (
        <Drawer
            anchor="left"
            open={isMobileSidebarOpen}
            onClose={onSidebarClose}
            variant="temporary"
            PaperProps={{
                sx: {
                    width: sidebarWidth,
                    boxShadow: theme => theme.shadows[8],
                },
            }}
        >
            <Box sx={{ height: '100%' }}>
                <Box px={3}>
                    <Logo />
                </Box>
                <Box>
                    <SidebarItems />
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
