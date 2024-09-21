'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import moment from 'moment';

import BuildDetailsLog from '@/app/(main)/builds/[buildId]/_components/BuildDetailsLog';

import type { BuildDetailsData } from '@/lib/api/getBuildDetails';
import getBuildDetails from '@/lib/api/getBuildDetails';

import { styled, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export interface BuildDetailsContentProps {
    initialDetails: BuildDetailsData;
    buildId: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
    minWidth: 'min(220px, 100%)',
    flex: '1 1 0',
    boxShadow: theme.shadows[3],

    '& .MuiCardHeader-title': {
        fontWeight: 600,
    },

    // remove padding from card content and header
    '& .MuiCardHeader-root': {
        padding: theme.spacing(1, 1, 0, 1),
    },

    '& .MuiCardContent-root': {
        padding: theme.spacing(1),
    },
}));

const BuildDetailsContent: FC<BuildDetailsContentProps> = ({
    initialDetails,
    buildId,
}) => {
    const theme = useTheme();

    const [details, setDetails] = useState<BuildDetailsData>(initialDetails);

    useEffect(() => {
        const interval = setInterval(async () => {
            const [data] = await getBuildDetails(buildId);

            if (data) {
                setDetails(data);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [buildId]);

    const [startedAt, setStartedAt] = useState<string | null>(null);
    const [finishedAt, setFinishedAt] = useState<string | null>(null);
    const [timeElapsed, setTimeElapsed] = useState<string | null>(null);

    useEffect(() => {
        if (details) {
            setStartedAt(
                moment(details.startedAt)
                    .locale(
                        typeof window !== 'undefined'
                            ? window.navigator.language
                            : 'en',
                    )
                    .format('YYYY-MM-DD HH:mm:ss'),
            );

            if (details.finishedAt) {
                setFinishedAt(
                    moment(details.finishedAt)
                        .locale(
                            typeof window !== 'undefined'
                                ? window.navigator.language
                                : 'en',
                        )
                        .format('YYYY-MM-DD HH:mm:ss'),
                );

                const duration = moment.duration(
                    moment(details.finishedAt).diff(moment(details.startedAt)),
                );

                const durationFormatted = `${duration.hours().toString().padStart(2, '0')}:${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;

                setTimeElapsed(
                    `${duration.humanize()} elapsed (${durationFormatted})`,
                );
            } else {
                setFinishedAt(null);
                setTimeElapsed(null);
            }
        }
    }, [details]);

    const version = useMemo(
        () =>
            !details
                ? null
                : `${details.version.pkgver}-${details.version.pkgrel}`,
        [details],
    );

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            {details ? (
                <Box display="flex" flexDirection="column" flex={1} gap={2}>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={2}
                        flexWrap="wrap"
                        justifyContent="center"
                    >
                        <StyledCard
                            style={{
                                backgroundColor: details.running
                                    ? theme.colorSchemes.light?.palette.warning
                                          .main
                                    : details.success
                                      ? theme.colorSchemes.light?.palette
                                            .success.main
                                      : theme.colorSchemes.light?.palette.error
                                            .main,
                                color: details.running
                                    ? theme.colorSchemes.light?.palette.warning
                                          .contrastText
                                    : details.success
                                      ? theme.colorSchemes.light?.palette
                                            .success.contrastText
                                      : theme.colorSchemes.light?.palette.error
                                            .contrastText,
                            }}
                        >
                            <CardHeader title="Build Status" />
                            <CardContent>
                                <Typography variant="body1">
                                    {details.running
                                        ? 'Running'
                                        : details.success
                                          ? 'Success'
                                          : 'Failed'}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                        <StyledCard
                            style={{
                                backgroundColor:
                                    theme.colorSchemes.light?.palette.primary
                                        .main,
                                color: theme.colorSchemes.light?.palette.primary
                                    .contrastText,
                            }}
                        >
                            <CardHeader title="Start Time" />
                            <CardContent>
                                {startedAt ? (
                                    <Typography variant="body1">
                                        {startedAt}
                                    </Typography>
                                ) : (
                                    <CircularProgress size={24} />
                                )}
                            </CardContent>
                        </StyledCard>
                        <StyledCard
                            style={{
                                backgroundColor:
                                    theme.colorSchemes.light?.palette.primary
                                        .main,
                                color: theme.colorSchemes.light?.palette.primary
                                    .contrastText,
                            }}
                        >
                            <CardHeader title="End Time" />
                            <CardContent>
                                {finishedAt ? (
                                    <>
                                        <Typography variant="body1">
                                            {finishedAt}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {timeElapsed}
                                        </Typography>
                                    </>
                                ) : (
                                    <CircularProgress size={24} />
                                )}
                            </CardContent>
                        </StyledCard>
                        <StyledCard
                            style={{
                                backgroundColor:
                                    theme.colorSchemes.light?.palette.primary
                                        .main,
                                color: theme.colorSchemes.light?.palette.primary
                                    .contrastText,
                            }}
                        >
                            <CardHeader title="Version" />
                            <CardContent>
                                {version !== null ? (
                                    <Typography variant="body1">
                                        {version}
                                    </Typography>
                                ) : (
                                    <CircularProgress size={24} />
                                )}
                            </CardContent>
                        </StyledCard>
                    </Box>
                    <Box flex={1} display="flex" flexDirection="column">
                        <BuildDetailsLog
                            logFileContents={details.logFileContents}
                        />
                    </Box>
                </Box>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                >
                    <Typography variant="h6">Loading build data...</Typography>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default BuildDetailsContent;
