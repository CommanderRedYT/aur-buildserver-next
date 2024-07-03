import type { FC } from 'react';

import SidebarItems from '@/components/layout/Sidebar/SidebarItems';
import Logo from '@/components/Logo';

import type { Theme } from '@mui/material';
import { Box, Drawer, useMediaQuery } from '@mui/material';

export interface SidebarProps {
    isMobileSidebarOpen: boolean;
    onSidebarClose: () => void;
    toggleMobileSidebar: () => void;
}

const sidebarWidth = '270px';

const Sidebar: FC<SidebarProps> = ({
    onSidebarClose,
    isMobileSidebarOpen,
    toggleMobileSidebar,
}) => {
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
                            <SidebarItems
                                toggleMobileSidebar={toggleMobileSidebar}
                            />
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
                    <SidebarItems toggleMobileSidebar={toggleMobileSidebar} />
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
