'use client';

import Link from 'next/link';

import type { FC, FormEvent } from 'react';
import React, { memo, useCallback, useMemo, useState } from 'react';

import { useSnackbar } from 'notistack';

import UndrawApplications from '@public/undraw/applications.svg';
import UndrawSearching from '@public/undraw/searching.svg';

import KnownPackageMenu from '@/app/(main)/packages/_components/KnownPackageMenu';
import KnownPackagesListItem from '@/app/(main)/packages/_components/KnownPackagesListItem';

import type { ListViewModes } from '@/types';

import FullWidthForm from '@/components/FullWidthForm';

import type {
    KnownPackagesData,
    KnownPackagesDataItem,
} from '@/lib/api/getKnownPackages';

import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import SearchIcon from '@mui/icons-material/Search';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

export interface KnownPackagesListProps {
    knownPackagesData: KnownPackagesData | null;
}

const KnownPackagesList: FC<KnownPackagesListProps> = ({
    knownPackagesData,
}) => {
    const [viewMode, setViewMode] = useState<ListViewModes>('grid');

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const { enqueueSnackbar } = useSnackbar();

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

    // const [selectedPackage, setSelectedPackage] =
    //     useState<KnownPackagesDataItem | null>(null);

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | {
        el: HTMLElement;
        pkg: KnownPackagesDataItem;
    }>(null);

    const openMenu = (
        event: React.MouseEvent<HTMLElement>,
        pkg: KnownPackagesDataItem,
    ): void => {
        setMenuAnchorEl({ el: event.currentTarget, pkg });
    };

    const closeMenu = (): void => {
        setMenuAnchorEl(null);
    };

    const computedViewMode = useMemo(() => {
        if (!knownPackagesData?.length) {
            return 'list';
        }

        return lgUp ? viewMode : 'list';
    }, [knownPackagesData?.length, lgUp, viewMode]);

    if (knownPackagesData === null) {
        return (
            <Typography variant="h4">Failed to fetch known packages</Typography>
        );
    }

    return (
        <>
            {(knownPackagesData?.length ?? 0) > 0 ? (
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
                                id="search-package"
                                label="Search known packages (not implemented yet)"
                                variant="filled"
                                fullWidth
                                size="small"
                                slotProps={{
                                    input: {
                                        endAdornment: loading ? (
                                            <CircularProgress size={20} />
                                        ) : null,
                                    },
                                }}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                disabled
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
                flex={knownPackagesData?.length ? undefined : 1}
            >
                {knownPackagesData ? (
                    <>
                        {knownPackagesData.length ? (
                            knownPackagesData.map(pkg => (
                                <Box
                                    width={
                                        computedViewMode === 'list'
                                            ? '100%'
                                            : 'auto'
                                    }
                                    key={pkg.name}
                                    flex={
                                        computedViewMode === 'list'
                                            ? '1 1 auto'
                                            : '1 1 300px'
                                    }
                                    display="flex"
                                >
                                    <KnownPackagesListItem
                                        onClick={() => {}}
                                        onOptionsClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openMenu(e, pkg);
                                        }}
                                        pkg={pkg}
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
                                            No packages added yet
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
            <Menu
                open={Boolean(menuAnchorEl)}
                anchorEl={menuAnchorEl?.el}
                onClose={closeMenu}
            >
                <KnownPackageMenu
                    open={Boolean(menuAnchorEl)}
                    onClose={closeMenu}
                    pkg={menuAnchorEl?.pkg}
                />
            </Menu>
        </>
    );
};

export default memo(KnownPackagesList);
