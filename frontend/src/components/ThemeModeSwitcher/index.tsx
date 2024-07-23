import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export interface ThemeModeSwitcherProps {
    style?: React.CSSProperties;
}

const ThemeModeSwitcher: FC<ThemeModeSwitcherProps> = ({ style }) => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'} arrow>
            <IconButton
                onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                style={style}
            >
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeModeSwitcher;
