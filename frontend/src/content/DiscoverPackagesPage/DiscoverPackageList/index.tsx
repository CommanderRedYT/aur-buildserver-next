import type { FC } from 'react';
import { memo, useMemo } from 'react';

import UndrawApplications from '@public/undraw/applications.svg';
import UndrawNoData from '@public/undraw/no_data.svg';

import type { TypeOfArrayItem } from '@/types';

import type { PackagesPageViewModes } from '@/content/DiscoverPackagesPage';
import DiscoverPackagesListItem from '@/content/DiscoverPackagesPage/DiscoverPackagesListItem';
import type { SearchPackageReturnType } from '@/lib/fetcher';

import { Box, Typography } from '@mui/material';

export interface DiscoverPackageListProps {
    viewMode: PackagesPageViewModes;
    fetchedPackages?: SearchPackageReturnType;
    setSelectedPackage: (
        pkg: TypeOfArrayItem<SearchPackageReturnType['results']>,
    ) => void;
    updateKnownPackages: () => void;
}

const DiscoverPackageList: FC<DiscoverPackageListProps> = ({
    viewMode,
    fetchedPackages,
    updateKnownPackages,
    setSelectedPackage,
}) => {
    const knownIds = useMemo(
        () =>
            fetchedPackages?.knownPackages
                ?.map(i => i.packageId)
                .filter(i => typeof i !== 'undefined') || [],
        [fetchedPackages],
    );

    return (
        <Box
            display="flex"
            flexDirection={viewMode === 'list' ? 'column' : 'row'}
            gap={1}
            flexWrap="wrap"
            flex={fetchedPackages?.results?.length ? undefined : 1}
        >
            {fetchedPackages?.results ? (
                <>
                    {fetchedPackages.results.length ? (
                        fetchedPackages.results.map(pkg => (
                            <Box
                                width={viewMode === 'list' ? '100%' : 'auto'}
                                key={pkg.Name}
                                flex={
                                    viewMode === 'list'
                                        ? '1 1 auto'
                                        : '1 1 300px'
                                }
                                display="flex"
                            >
                                <DiscoverPackagesListItem
                                    onClick={() => setSelectedPackage(pkg)}
                                    updateKnownPackages={updateKnownPackages}
                                    isKnownPackage={
                                        typeof pkg.ID !== 'undefined'
                                            ? knownIds.includes(pkg.ID)
                                            : false
                                    }
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
                                    No packages found
                                </Typography>
                                <Typography variant="body1" align="center">
                                    Try searching for something else
                                </Typography>
                            </Box>
                            <UndrawNoData height="50%" width="100%" />
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
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h4" align="center" gutterBottom>
                            No packages fetched
                        </Typography>
                        <Typography variant="body1" align="center">
                            Enter a search term into the field above and press
                            enter to search for packages
                        </Typography>
                    </Box>
                    <UndrawApplications height="50%" width="100%" />
                </Box>
            )}
        </Box>
    );
};

export default memo(DiscoverPackageList);
