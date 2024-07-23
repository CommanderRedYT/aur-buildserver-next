'use client';

import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import CustomSkeletonWave from '@/components/CustomSkeletonWave';

import type { FetchInfoReturnType } from '@/lib/fetcher';
import getContrastColor from '@/lib/getContrastColor';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledCodeBlock = styled('code')(({ theme }) => ({
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontFamily: 'monospace',
    fontSize: '1rem',
    lineHeight: '1.5',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius * 4,
    backgroundColor: '#0d1117',
    color: getContrastColor('#0d1117'),
    ...theme.applyStyles('dark', {
        backgroundColor: '#202b34',
        color: getContrastColor('#202b34'),
    }),
    boxShadow: theme.shadows[4],
    margin: '0',
    flex: '1',
    width: '100%',
    maxWidth: '100%',
}));

// convert to echo command
const renderPacmanConfTemplate = (url: string): string =>
    `# echo "[aurnext]\\nServer = ${url}" >> /etc/pacman.conf`;

const renderAddKeyTemplate = (info: FetchInfoReturnType): string =>
    `# pacman-key --recv-keys ${info.signingKeyId}
# pacman-key --lsign-key ${info.signingKeyId}
# pacman -Sy
# pacman -Sl aurnext
`;

const UsageContentContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    margin: 'auto',
    borderRadius: theme.shape.borderRadius * 10,
    width: '75%',
    minWidth: '340px',
    backgroundColor: theme.vars.palette.background.default,
    boxShadow: theme.shadows[1],
}));

const UsageContent: FC<FetchInfoReturnType> = info => {
    const theme = useTheme();
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(
                `${window.location.protocol}//${window.location.host}/repo/`,
            );
        }
    }, []);

    return (
        <UsageContentContainer>
            <Typography variant="h4" textAlign="center">
                How to use this repository
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body1" paddingX={1}>
                    First, you need to add the repository to your pacman config.
                    For this, you need to add the url of the repository to your{' '}
                    <code>/etc/pacman.conf</code> file.
                </Typography>
                {url ? (
                    <StyledCodeBlock>
                        {renderPacmanConfTemplate(url)}
                    </StyledCodeBlock>
                ) : (
                    <CustomSkeletonWave
                        variant="rounded"
                        height={100}
                        style={{ borderRadius: theme.shape.borderRadius * 4 }}
                        waveColor="#0d1117"
                        darkWaveColor="#202b34"
                    />
                )}
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body1" paddingX={1}>
                    After adding the repository, you need to add the key to
                    pacman. This is necessary to verify the packages from the
                    repository.
                </Typography>
                <StyledCodeBlock>{renderAddKeyTemplate(info)}</StyledCodeBlock>
            </Box>
        </UsageContentContainer>
    );
};

export default UsageContent;
