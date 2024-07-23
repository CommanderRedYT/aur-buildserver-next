import type { FC } from 'react';

import getContrastColor from '@/lib/getContrastColor';

import type { SkeletonProps } from '@mui/material';
import { alpha } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export interface CustomSkeletonWaveProps
    extends Omit<SkeletonProps, 'animation'> {
    waveColor?: string;
    darkWaveColor?: string; // workaround for dark mode
}

const CustomSkeletonWave: FC<CustomSkeletonWaveProps> = ({
    waveColor,
    darkWaveColor,
    ...rest
}) => (
    <Skeleton
        variant="rectangular"
        animation="wave"
        sx={theme => ({
            backgroundColor: waveColor,
            ...theme.applyStyles('dark', {
                backgroundColor: darkWaveColor,
            }),
            '&::after': {
                background: waveColor
                    ? `linear-gradient(90deg, transparent, ${alpha(getContrastColor(waveColor), 0.15)}, transparent)`
                    : undefined,
            },
        })}
        {...rest}
    />
);

export default CustomSkeletonWave;
