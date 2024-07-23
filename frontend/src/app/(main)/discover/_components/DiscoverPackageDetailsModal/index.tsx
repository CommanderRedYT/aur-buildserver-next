import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import { useSnackbar } from 'notistack';

import type { CommonModalProps, TypeOfArrayItem } from '@/types';

import CustomModal from '@/components/CustomModal';
import PackageDependency from '@/components/PackageDependency';
import PkgbuildViewer from '@/components/PkgbuildViewer';

import { aurPackageUrl } from '@/constants/urls';
import addPackageToPackageList from '@/lib/api/addPackageToPackageList';
import fetchDetailedPackage from '@/lib/api/fetchDetailedPackage';
import fetchPkgbuild from '@/lib/api/fetchPkgbuild';
import type {
    FetchDetailedReturnType,
    SearchPackageReturnType,
} from '@/lib/fetcher';
import { generateColorPropsFromString } from '@/lib/generateColor';
import stringAvatar from '@/lib/stringAvatar';

import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export type PackageType =
    | 'Depends'
    | 'MakeDepends'
    | 'OptDepends'
    | 'CheckDepends';

export interface DiscoverPackageDetailsModalProps extends CommonModalProps {
    pkg: TypeOfArrayItem<SearchPackageReturnType['results']> | null;
    updateKnownPackages: () => void;
}

interface PackageData
    extends TypeOfArrayItem<FetchDetailedReturnType['results']> {
    aurPackages: string[];
}

const DiscoverPackageDetailsModal: FC<DiscoverPackageDetailsModalProps> = ({
    open,
    onClose,
    pkg,
    updateKnownPackages,
}) => {
    const theme = useTheme();
    const [showPkgbuildOpen, setShowPkgbuildOpen] = useState<boolean>(false);

    const [pkgbuild, setPkgbuild] = useState<string | null>(null);
    const [packageData, setPackageData] = useState<PackageData | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setPkgbuild(null);
        setPackageData(null);

        if (pkg) {
            fetchPkgbuild(pkg)
                .then(fetchedPkgbuild => {
                    setPkgbuild(fetchedPkgbuild);
                })
                .catch(e => {
                    console.error('Failed to fetch PKGBUILD', e);
                });

            fetchDetailedPackage(pkg)
                .then(fetchedPackageData => {
                    if (fetchedPackageData.results?.length !== 1) {
                        throw new Error('Invalid package data');
                    }

                    const data = fetchedPackageData.results[0];
                    const aurPackages = fetchedPackageData.aurPackages ?? [];

                    if (!data) {
                        throw new Error('Invalid package data');
                    }

                    setPackageData({
                        ...data,
                        aurPackages,
                    });
                })
                .catch(e => {
                    console.error('Failed to fetch detailed package data', e);
                });
        }
    }, [pkg]);

    const openAur = (): void => {
        if (!pkg?.Name) {
            return;
        }

        window.open(aurPackageUrl(pkg.Name), '_blank', 'noopener');
    };

    const mergedDependencies = useMemo(() => {
        const deps = new Set<{ packageName: string; type: PackageType }>();

        if (packageData) {
            packageData.Depends?.forEach(dep =>
                deps.add({ packageName: dep, type: 'Depends' }),
            );
            packageData.MakeDepends?.forEach(dep =>
                deps.add({ packageName: dep, type: 'MakeDepends' }),
            );
            packageData.OptDepends?.forEach(dep =>
                deps.add({ packageName: dep, type: 'OptDepends' }),
            );
            packageData.CheckDepends?.forEach(dep =>
                deps.add({ packageName: dep, type: 'CheckDepends' }),
            );
        }

        return Array.from(deps);
    }, [packageData]);

    if (!pkg) {
        return null;
    }

    return (
        <>
            <CustomModal
                open={open}
                onClose={onClose}
                showCloseButton
                title={pkg.Name}
                leftIcon={<Avatar {...stringAvatar(pkg.Maintainer)} />}
            >
                <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                        <Typography variant="subtitle2">Details</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {pkg.Description}
                        </Typography>
                        {packageData ? (
                            <Typography variant="body2" color="textSecondary">
                                {packageData.License}
                            </Typography>
                        ) : null}
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        flexWrap="wrap"
                        justifyContent="space-evenly"
                    >
                        {packageData ? (
                            <>
                                <Box flex={1} minWidth={200}>
                                    <Typography variant="subtitle2">
                                        Submitter
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {packageData.Submitter || 'None'}
                                    </Typography>
                                </Box>
                                <Box flex={1} minWidth={200}>
                                    <Typography variant="subtitle2">
                                        Maintainer
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {packageData.Maintainer || 'None'}
                                    </Typography>
                                </Box>
                                {pkg.URL ? (
                                    <Box flex={1} minWidth={200}>
                                        <Typography variant="subtitle2">
                                            Upstream
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            <a
                                                href={pkg.URL}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: 'inherit' }}
                                            >
                                                {pkg.URL}
                                            </a>
                                        </Typography>
                                    </Box>
                                ) : null}
                            </>
                        ) : null}
                    </Box>
                    <Box>
                        <Typography variant="subtitle2">
                            Dependencies ({mergedDependencies.length})
                        </Typography>
                        {mergedDependencies.length === 0 ? (
                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="center"
                            >
                                <CircularProgress />
                            </Box>
                        ) : null}
                        <Box
                            display="flex"
                            gap={1}
                            flexWrap="wrap"
                            alignItems="baseline"
                        >
                            {mergedDependencies.map(({ packageName, type }) => (
                                <PackageDependency
                                    key={`dependency-${packageName}-${type}`}
                                    packageName={packageName}
                                    isAur={
                                        !!packageData?.aurPackages.includes(
                                            packageName,
                                        )
                                    }
                                    theme={theme}
                                    type={type}
                                />
                            ))}
                        </Box>
                    </Box>
                    {packageData?.Keywords ? (
                        <Box>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {packageData.Keywords.map(keyword => (
                                    <Chip
                                        key={`keyword-${pkg.Name}-${keyword}`}
                                        label={keyword}
                                        variant="outlined"
                                        style={{
                                            ...generateColorPropsFromString(
                                                theme.palette.primary.main,
                                                keyword,
                                                {
                                                    backgroundColor: 'normal',
                                                    borderColor: 'normal',
                                                    color: 'contrast',
                                                },
                                            ),
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    ) : null}
                </Box>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    gap={1}
                    mt={4}
                    flexWrap="wrap"
                >
                    {pkg.Name ? (
                        <Button
                            variant="text"
                            onClick={openAur}
                            startIcon={<OpenInNewIcon />}
                            size="small"
                            style={{
                                flex: 1,
                            }}
                        >
                            Open in AUR
                        </Button>
                    ) : null}
                    <Button
                        variant="text"
                        onClick={() => setShowPkgbuildOpen(true)}
                        startIcon={<CodeIcon />}
                        size="small"
                        style={{
                            flex: 1,
                        }}
                    >
                        View PKGBUILD
                    </Button>
                    <Button
                        variant="contained"
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();

                            addPackageToPackageList(pkg)
                                .then(() => {
                                    updateKnownPackages();
                                    enqueueSnackbar(
                                        'Package added to package list',
                                        { variant: 'success' },
                                    );
                                })
                                .catch(err => {
                                    enqueueSnackbar(
                                        err?.data?.message ?? 'Unknown error',
                                        {
                                            variant: 'error',
                                        },
                                    );
                                    throw err;
                                });
                        }}
                        startIcon={<AddIcon />}
                        size="small"
                        style={{
                            flex: 1,
                        }}
                    >
                        Add to package list
                    </Button>
                </Box>
            </CustomModal>
            <CustomModal
                open={showPkgbuildOpen}
                onClose={() => setShowPkgbuildOpen(false)}
                showCloseButton
                title={`PKGBUILD for ${pkg.Name}`}
                overrideWidth={1000}
            >
                <PkgbuildViewer pkgbuild={pkgbuild} />
            </CustomModal>
        </>
    );
};

export default DiscoverPackageDetailsModal;
