'use client';

import type { FC } from 'react';
import { memo } from 'react';

import UndrawApplications from '@public/undraw/applications.svg';
import UndrawNoData from '@public/undraw/no_data.svg';

import type { KnownPackages } from '@/content/KnownPackagesPage';
import KnownPackagesListItem from '@/content/KnownPackagesPage/KnownPackagesListItem';

import { Box, Typography } from '@mui/material';

export interface KnownPackageListProps {
    knownPackages: KnownPackages;
}

const KnownPackagesList: FC<KnownPackageListProps> = ({ knownPackages }) => {
    const viewMode = 'list';

    return (
        <Box
            display="flex"
            flexDirection={viewMode === 'list' ? 'column' : 'row'}
            gap={1}
            flexWrap="wrap"
            flex={knownPackages?.length ? undefined : 1}
        >
            {knownPackages ? (
                <>
                    {knownPackages.length ? (
                        knownPackages.map(pkg => (
                            <Box
                                width={viewMode === 'list' ? '100%' : 'auto'}
                                key={pkg.name}
                                flex={
                                    viewMode === 'list'
                                        ? '1 1 auto'
                                        : '1 1 300px'
                                }
                                display="flex"
                            >
                                <KnownPackagesListItem
                                    onClick={() => {}}
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
                                    No packages added yet
                                </Typography>
                                <Typography variant="body1" align="center">
                                    To add a package, search for it in under
                                    discovery
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
                            No data fetched
                        </Typography>
                        <Typography variant="body1" align="center">
                            Try again later
                        </Typography>
                    </Box>
                    <UndrawApplications height="50%" width="100%" />
                </Box>
            )}
        </Box>
    );
};

export default memo(KnownPackagesList);
