'use client';

import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';

import { LazyLog, ScrollFollow } from '@melloware/react-logviewer';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export interface BuildDetailsLogProps {
    logFileContents?: string;
}

const BuildDetailsLog: FC<BuildDetailsLogProps> = ({ logFileContents }) => {
    const theme = useTheme();

    const [parsed, setParsed] = useState<string | null>(null);

    useEffect(() => {
        const data = logFileContents?.split('\n').map(line => {
            try {
                return JSON.parse(line).data;
            } catch (e) {
                return line;
            }
        });

        if (data) {
            setParsed(data.join('\n'));
        }
    }, [logFileContents]);

    return (
        <Box height="70vh" width="100%" borderRadius={16}>
            <style>
                {`
                .react-lazylog-searchbar {
                    border-top-right-radius: 16px;
                    border-top-left-radius: 16px;
                    background-color: ${theme.colorSchemes.dark.palette.background.paper};
                    border-bottom: 1px solid ${theme.colorSchemes.dark.palette.divider};
                }
            `}
            </style>
            {parsed ? (
                <ScrollFollow
                    startFollowing
                    render={({ follow, onScroll }) => (
                        <LazyLog
                            text={parsed}
                            follow={follow}
                            onScroll={onScroll}
                            enableSearch
                            caseInsensitive
                            enableHotKeys
                            selectableLines
                            style={{
                                backgroundColor:
                                    theme.colorSchemes.dark.palette.background
                                        .paper,
                                color: theme.colorSchemes.dark.palette.text
                                    .primary,
                                borderBottomRightRadius: 16,
                                borderBottomLeftRadius: 16,
                                boxShadow: theme.shadows[5],
                            }}
                            extraLines={1}
                        />
                    )}
                />
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                >
                    <Typography variant="h6">Loading log...</Typography>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default memo(BuildDetailsLog);
