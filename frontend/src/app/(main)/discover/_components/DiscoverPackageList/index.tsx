import type { FC } from 'react';
import { memo, useMemo } from 'react';

import UndrawApplications from '@public/undraw/applications.svg';
import UndrawNoData from '@public/undraw/no_data.svg';

import DiscoverPackagesListItem from '@/app/(main)/discover/_components/DiscoverPackagesListItem';

import type { ListViewModes, TypeOfArrayItem } from '@/types';

import type { SearchPackageReturnType } from '@/lib/fetcher';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface DiscoverPackageListProps {
    viewMode: ListViewModes;
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
                        // TODO: for now, hard limit to 100 results
                        fetchedPackages.results.slice(0, 100).map(pkg => (
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
                            <UndrawNoData height="50%" width="50%" />
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
                        <Typography variant="h4" align="center" gutterBottom>
                            Search for packages
                        </Typography>
                        <Typography variant="body1" align="center">
                            Enter a search term into the field above and press
                            enter to search for packages
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default memo(DiscoverPackageList);
