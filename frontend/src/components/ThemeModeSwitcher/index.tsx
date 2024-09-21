import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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

    const nextMode = (): void => {
        switch (mode) {
            case 'light':
                setMode('dark');
                break;
            case 'dark':
                setMode('system');
                break;
            case 'system':
                setMode('light');
                break;
            default:
                setMode('light');
                break;
        }
    };

    const icon = useMemo(
        () =>
            mode === 'dark' ? (
                <DarkModeIcon />
            ) : mode === 'light' ? (
                <LightModeIcon />
            ) : (
                <AutoAwesomeIcon />
            ),
        [mode],
    );

    const modeName = useMemo(
        () =>
            mode === 'light'
                ? 'Light mode'
                : mode === 'dark'
                  ? 'Dark mode'
                  : 'System',
        [mode],
    );

    if (!mounted) return null;

    return (
        <Tooltip title={modeName} arrow>
            <IconButton onClick={nextMode} style={style}>
                {icon}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeModeSwitcher;
