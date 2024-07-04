import type { FC } from 'react';

import CustomModal from '@/components/CustomModal';

import type { ButtonProps } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';

export type ConfirmationModalAction = 'confirm' | 'cancel';

export interface ConfirmationModalProps {
    title: string;
    message: string;
    open: boolean;
    onClose: (action: ConfirmationModalAction) => void;
    confirmButtonProps?: Omit<ButtonProps, 'onClick'>;
    cancelButtonProps?: Omit<ButtonProps, 'onClick'>;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
    title,
    message,
    open,
    onClose,
    confirmButtonProps,
    cancelButtonProps,
    confirmButtonText,
    cancelButtonText,
}) => (
    <CustomModal
        open={open}
        onClose={() => onClose('cancel')}
        title={title}
        showCloseButton
    >
        <Typography>{message}</Typography>
        <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
                variant="text"
                color="secondary"
                {...cancelButtonProps}
                onClick={() => onClose('cancel')}
            >
                {cancelButtonText ?? 'Cancel'}
            </Button>
            <Button
                variant="contained"
                color="primary"
                {...confirmButtonProps}
                onClick={() => onClose('confirm')}
            >
                {confirmButtonText ?? 'Confirm'}
            </Button>
        </Box>
    </CustomModal>
);

export default ConfirmationModal;
