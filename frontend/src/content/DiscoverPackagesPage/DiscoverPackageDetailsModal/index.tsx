import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type { CommonModalProps, TypeOfArrayItem } from '@/types';

import CustomModal from '@/components/CustomModal';
import PkgbuildViewer from '@/components/PkgbuildViewer';

import fetchPkgbuild from '@/lib/api/fetchPkgbuild';
import type { SearchPackageReturnType } from '@/lib/fetcher';

import CodeIcon from '@mui/icons-material/Code';
import { Box, Button, Typography } from '@mui/material';

export interface DiscoverPackageDetailsModalProps extends CommonModalProps {
    pkg: TypeOfArrayItem<SearchPackageReturnType['results']> | null;
}

const DiscoverPackageDetailsModal: FC<DiscoverPackageDetailsModalProps> = ({
    open,
    onClose,
    pkg,
}) => {
    const [showPkgbuildOpen, setShowPkgbuildOpen] = useState<boolean>(false);

    const [pkgbuild, setPkgbuild] = useState<string | null>(null);

    useEffect(() => {
        if (open && pkg) {
            fetchPkgbuild(pkg)
                .then(fetchedPkgbuild => {
                    setPkgbuild(fetchedPkgbuild);
                })
                .catch(e => {
                    console.error('Failed to fetch PKGBUILD', e);
                });
        }
    }, [open, pkg]);

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
            >
                <Box>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        {pkg.Description}
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={() => setShowPkgbuildOpen(true)}
                        startIcon={<CodeIcon />}
                    >
                        View PKGBUILD
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
