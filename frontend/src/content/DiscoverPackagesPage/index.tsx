'use client';

import type { FC, FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { TypeOfArrayItem } from '@/types';

import FullWidthForm from '@/components/FullWidthForm';

import DiscoverPackageDetailsModal from '@/content/DiscoverPackagesPage/DiscoverPackageDetailsModal';
import DiscoverPackageList from '@/content/DiscoverPackagesPage/DiscoverPackageList';
import type { SearchPackageReturnType } from '@/lib/fetcher';
import backendFetcherApi from '@/lib/fetcher';

import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import type { Theme } from '@mui/material';
import {
    Box,
    CircularProgress,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useMediaQuery,
} from '@mui/material';

const searchEndpoint = backendFetcherApi('/api/aur/search/{packageName}')
    .method('get')
    .create();

const knownPackagesEndpoint = backendFetcherApi('/api/packages/list')
    .method('get')
    .create();

export type PackagesPageViewModes = 'list' | 'grid';

const DiscoverPackagesPage: FC = () => {
    const [fetchedPackages, setFetchedPackages] = useState<
        SearchPackageReturnType | undefined
    >(undefined);
    const [viewMode, setViewMode] = useState<PackagesPageViewModes>('list');

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const handleSearch = useCallback(
        async (event: FormEvent) => {
            event.preventDefault();
            setError(null);

            if (!searchQuery) {
                setError('Search query cannot be empty');
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
                    setError('Failed to fetch packages');
                    return;
                }

                const { success, data } = response.data;

                if (!success) {
                    console.error('success === false', data);
                    setError('Failed to fetch packages');
                    return;
                }

                if ((data?.results?.length ?? 0) > 10) {
                    setViewMode('grid');
                } else {
                    setViewMode('list');
                }

                if (data && data.type === 'error' && 'error' in data) {
                    setError(data.error as string);
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
                setError('Failed to fetch packages');
            }
        },
        [searchQuery],
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
        <Box display="flex" flexDirection="column" flex={1}>
            <Box
                display="flex"
                width="100%"
                paddingY={1}
                flexDirection="column"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h4">Discover AUR packages</Typography>
            </Box>
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
                            size="small"
                            InputProps={{
                                endAdornment: loading ? (
                                    <CircularProgress size={20} />
                                ) : null,
                            }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            error={Boolean(error)}
                            helperText={error}
                        />
                    </FullWidthForm>
                    {lgUp && moreThanOnePackageAvailable ? (
                        <ToggleButtonGroup
                            sx={{
                                alignSelf: 'flex-start',
                            }}
                            value={viewMode}
                            exclusive
                            onChange={(_, newValue) => {
                                if (newValue) {
                                    setViewMode(newValue);
                                }
                            }}
                            size="small"
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
                pkg={selectedPackage}
            />
        </Box>
    );
};

export default DiscoverPackagesPage;
