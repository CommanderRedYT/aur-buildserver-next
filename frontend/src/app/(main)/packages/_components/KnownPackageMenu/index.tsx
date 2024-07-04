import { useRouter } from 'next/navigation';

import type { FC } from 'react';

import { useSnackbar } from 'notistack';

import type { KnownPackagesDataItem } from '@/app/(main)/packages/page';

import useConfirmationModal from '@/hooks/useConfirmationModal';

import removePackageFromPackageList from '@/lib/api/removePackageFromPackageList';

import DeleteIcon from '@mui/icons-material/Delete';
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
} from '@mui/material';

export interface KnownPackageMenuProps {
    open: boolean;
    onClose: () => void;
    pkg?: KnownPackagesDataItem;
}

const KnownPackageMenu: FC<KnownPackageMenuProps> = ({ onClose, pkg }) => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const handleDelete = async (): Promise<void> => {
        if (!pkg) {
            enqueueSnackbar('No package provided to delete', {
                variant: 'error',
            });
            return;
        }

        onClose();

        removePackageFromPackageList(pkg)
            .then(() => {
                enqueueSnackbar('Package deleted', { variant: 'success' });
                router.refresh();
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    const confirmDeleteModal = useConfirmationModal({
        title: `Delete package ${pkg?.name}`,
        message: 'Are you sure you want to delete this package?',
        onConfirm: handleDelete,
        cancelButtonProps: {
            color: 'primary',
        },
        confirmButtonProps: {
            color: 'error',
        },
    });

    return (
        <>
            <Paper sx={{ width: 320, maxWidth: '100%' }}>
                <MenuList>
                    <MenuItem onClick={confirmDeleteModal.open}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </MenuList>
            </Paper>
            <confirmDeleteModal.Component />
        </>
    );
};

export default KnownPackageMenu;
