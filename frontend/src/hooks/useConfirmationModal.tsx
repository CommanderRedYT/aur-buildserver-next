import React from 'react';

import type { ConfirmationModalProps } from '@/components/ConfirmationModal';
import ConfirmationModal from '@/components/ConfirmationModal';

import type { ButtonProps } from '@mui/material';

export interface UseConfirmationModalOptions
    extends Pick<ConfirmationModalProps, 'title' | 'message'> {
    onConfirm: () => void;
    onCancel?: () => void;
    confirmButtonProps?: Omit<ButtonProps, 'onClick'>;
    cancelButtonProps?: Omit<ButtonProps, 'onClick'>;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

export type UseConfirmationModal = (props: UseConfirmationModalOptions) => {
    open: () => void;
    close: () => void;
    Component: React.FC;
};

const useConfirmationModal: UseConfirmationModal = props => {
    const [open, setOpen] = React.useState(false);

    const openModal = (): void => {
        setOpen(true);
    };

    const closeModal = (): void => {
        setOpen(false);
    };

    const Component: React.FC = () => (
        <ConfirmationModal
            {...props}
            open={open}
            onClose={action => {
                if (action === 'confirm') {
                    props.onConfirm();
                } else if (props.onCancel) {
                    props.onCancel();
                }
                closeModal();
            }}
        />
    );

    return { open: openModal, close: closeModal, Component };
};

export default useConfirmationModal;
