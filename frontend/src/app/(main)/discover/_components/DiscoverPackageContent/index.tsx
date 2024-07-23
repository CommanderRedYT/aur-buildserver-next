'use client';

import type { FC, FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { useSnackbar } from 'notistack';

import DiscoverPackageDetailsModal from '@/app/(main)/discover/_components/DiscoverPackageDetailsModal';
import DiscoverPackageList from '@/app/(main)/discover/_components/DiscoverPackageList';

import type { ListViewModes, TypeOfArrayItem } from '@/types';

import FullWidthForm from '@/components/FullWidthForm';

import type { SearchPackageReturnType } from '@/lib/fetcher';
import backendFetcherApi from '@/lib/fetcher';

import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const searchEndpoint = backendFetcherApi('/api/aur/search/{packageName}')
    .method('get')
    .create();

const knownPackagesEndpoint = backendFetcherApi('/api/packages/list')
    .method('get')
    .create();

const DiscoverPackageContent: FC = () => {
    const [fetchedPackages, setFetchedPackages] = useState<
        SearchPackageReturnType | undefined
    >(undefined);

    const [viewMode, setViewMode] = useState<ListViewModes>('list');

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

                const response = await searchEndpoint({
                    packageName: searchQuery,
                });

                setLoading(false);

                if (!response.ok) {
                    console.error('!response.ok', response);
                    enqueueSnackbar('Failed to fetch packages', {
                        variant: 'error',
                    });
                    return;
                }

                const { success, data } = response.data;

                if (!success) {
                    console.error('success === false', data);
                    enqueueSnackbar('Failed to fetch packages', {
                        variant: 'error',
                    });
                    return;
                }

                if ((data?.results?.length ?? 0) > 10) {
                    setViewMode('grid');
                } else {
                    setViewMode('list');
                }

                if (data && data.type === 'error' && 'error' in data) {
                    enqueueSnackbar(data.error as string, { variant: 'error' });
                    return;
                }

                // sort by popularity
                setFetchedPackages({
                    ...data,
                    results: data?.results?.sort((a, b) => {
                        if (a.Popularity === b.Popularity) {
                            return 0;
                        }

                        if (typeof a.Popularity === 'undefined') {
                            return 1;
                        }

                        if (typeof b.Popularity === 'undefined') {
                            return -1;
                        }

                        return a.Popularity > b.Popularity ? -1 : 1;
                    }),
                });
            } catch (e) {
                setLoading(false);
                console.error(e);
                enqueueSnackbar('Failed to fetch packages', {
                    variant: 'error',
                });
            }
        },
        [searchQuery, enqueueSnackbar],
    );

    const [selectedPackage, setSelectedPackage] = useState<TypeOfArrayItem<
        SearchPackageReturnType['results']
    > | null>(null);

    const moreThanOnePackageAvailable = useMemo(() => {
        const packageCount = fetchedPackages?.results?.length ?? 0;

        return packageCount > 1;
    }, [fetchedPackages?.results?.length]);

    const computedViewMode = useMemo(
        () => (lgUp && moreThanOnePackageAvailable ? viewMode : 'list'),
        [moreThanOnePackageAvailable, lgUp, viewMode],
    );

    const updateKnownPackages = useCallback(async (): Promise<void> => {
        if (!fetchedPackages) {
            console.error('!fetchedPackages');
            return;
        }

        const result = await knownPackagesEndpoint({});

        if (!result.ok) {
            console.error('!result.ok', result);
            return;
        }

        const { success, data } = result.data;

        if (!success || typeof data === 'undefined') {
            console.error('success === false', success, typeof data);
            return;
        }

        setFetchedPackages({
            ...fetchedPackages,
            knownPackages: data.filter(i => typeof i.packageId !== 'undefined'),
        });
    }, [fetchedPackages]);

    return (
        <>
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
                            label="Search for AUR packages"
                            variant="filled"
                            fullWidth
                            focused
                            autoFocus
                            size="small"
                            InputProps={{
                                endAdornment: loading ? (
                                    <CircularProgress size={20} />
                                ) : null,
                            }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </FullWidthForm>
                    {lgUp && moreThanOnePackageAvailable ? (
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
            <DiscoverPackageList
                viewMode={computedViewMode}
                fetchedPackages={fetchedPackages}
                setSelectedPackage={setSelectedPackage}
                updateKnownPackages={updateKnownPackages}
            />
            <DiscoverPackageDetailsModal
                open={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
                updateKnownPackages={updateKnownPackages}
                pkg={selectedPackage}
            />
        </>
    );
};

export default DiscoverPackageContent;
