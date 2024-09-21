'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { FC, FormEvent } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useSnackbar } from 'notistack';

import UndrawApplications from '@public/undraw/applications.svg';
import UndrawSearching from '@public/undraw/searching.svg';

import BuildListItem from '@/app/(main)/builds/_components/BuildListItem';

import type { ListViewModes } from '@/types';

import FullWidthForm from '@/components/FullWidthForm';

import type { BuildsData } from '@/lib/api/getBuilds';
import getBuilds from '@/lib/api/getBuilds';

import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import SearchIcon from '@mui/icons-material/Search';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

export interface BuildListProps {
    initialBuildsData: BuildsData | null;
}

const BuildList: FC<BuildListProps> = ({ initialBuildsData }) => {
    const router = useRouter();

    const [viewMode, setViewMode] = useState<ListViewModes>('list');

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const { enqueueSnackbar } = useSnackbar();

    const [buildsData, setBuildsData] = useState<BuildsData | null>(
        initialBuildsData,
    );

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const [data] = await getBuilds();

                if (data) {
                    setBuildsData(data);
                }
            } catch (e) {
                console.error(e);
                enqueueSnackbar('Failed to fetch builds', {
                    variant: 'error',
                });
            }
        }, 10 * 1000);

        return () => clearInterval(interval);
    }, [enqueueSnackbar]);

    const handleSearch = useCallback(
        async (event: FormEvent) => {
            event.preventDefault();

            if (!searchQuery) {
                enqueueSnackbar('Search query cannot be empty', {
                    variant: 'error',
                });
                return;
            }

            try {
                setLoading(true);

                // do sth

                setLoading(false);
            } catch (e) {
                setLoading(false);
                console.error(e);
                enqueueSnackbar('Failed to fetch packages', {
                    variant: 'error',
                });
            }
        },
        [enqueueSnackbar, searchQuery],
    );

    const computedViewMode = useMemo(
        () => (lgUp ? viewMode : 'list'),
        [lgUp, viewMode],
    );

    if (buildsData === null) {
        return <Typography variant="h4">Failed to fetch builds</Typography>;
    }

    return (
        <>
            {(buildsData?.length ?? 0) > 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    marginBottom={2}
                    gap={2}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={2}
                        alignItems="center"
                        width="100%"
                    >
                        <FullWidthForm onSubmit={handleSearch}>
                            <TextField
                                id="search-builds"
                                label="Search builds"
                                variant="filled"
                                fullWidth
                                size="small"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                slotProps={{
                                    input: {
                                        endAdornment: loading ? (
                                            <CircularProgress size={20} />
                                        ) : null,
                                    },
                                }}
                            />
                        </FullWidthForm>
                        {lgUp ? (
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(_, newValue) => {
                                    if (newValue) {
                                        setViewMode(newValue);
                                    }
                                }}
                            >
                                <ToggleButton value="list">
                                    <FormatListBulletedRoundedIcon />
                                </ToggleButton>
                                <ToggleButton value="grid">
                                    <GridViewRoundedIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        ) : null}
                    </Box>
                </Box>
            ) : null}
            <Box
                display="flex"
                flexDirection={computedViewMode === 'list' ? 'column' : 'row'}
                gap={1}
                flexWrap="wrap"
                flex={buildsData?.length ? undefined : 1}
            >
                {buildsData ? (
                    <>
                        {buildsData.length ? (
                            buildsData.map(build => (
                                <Box
                                    width={
                                        computedViewMode === 'list'
                                            ? '100%'
                                            : 'auto'
                                    }
                                    key={build.id}
                                    flex={
                                        computedViewMode === 'list'
                                            ? '1 1 auto'
                                            : '1 1 300px'
                                    }
                                    display="flex"
                                >
                                    <BuildListItem
                                        onClick={() => {
                                            router.push(`/builds/${build.id}`);
                                        }}
                                        build={build}
                                    />
                                </Box>
                            ))
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                bgcolor="background.paper"
                                borderRadius={8}
                                flex={1}
                                gap={7}
                                padding={8}
                            >
                                <UndrawSearching height="50%" width="50%" />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box mb={4}>
                                        <Typography
                                            variant="h4"
                                            align="center"
                                            gutterBottom
                                        >
                                            No builds found
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            align="center"
                                        >
                                            To get started, add some packages to
                                            your package list. Builds should
                                            then start automatically.
                                        </Typography>
                                    </Box>
                                    <Box width="100%">
                                        <Link href="/discover">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                startIcon={<SearchIcon />}
                                            >
                                                Discover packages
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </>
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor="background.paper"
                        borderRadius={8}
                        flex={1}
                        gap={7}
                        padding={8}
                    >
                        <UndrawApplications height="50%" width="50%" />
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                            >
                                No data fetched
                            </Typography>
                            <Typography variant="body1" align="center">
                                Try again later
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default memo(BuildList);
