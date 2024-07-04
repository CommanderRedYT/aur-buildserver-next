import type { FC } from 'react';
import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import type { ModalProps } from '@mui/material';
import { Box, IconButton, Modal, styled, Typography } from '@mui/material';

const ModalContentWrapper = styled(Box, {
    shouldForwardProp: propName => propName !== 'overrideWidth',
})<{ overrideWidth?: number }>(({ theme, overrideWidth }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: overrideWidth ?? 500,
    maxWidth: 'calc(100% - 32px)',
    maxHeight: 'calc(100% - 32px)',

    display: 'flex',
    flexDirection: 'column',
    borderRadius: 24,
    boxShadow: 'none',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,

    [theme.breakpoints.up('lg')]: {
        width: overrideWidth ?? 700,
    },
}));

export interface CustomModalProps extends Omit<ModalProps, 'children'> {
    title?: string;
    showCloseButton?: boolean;
    overrideWidth?: number;
    children: React.ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({
    children,
    showCloseButton,
    title,
    overrideWidth,
    ...props
}) => (
    <Modal
        {...props}
        sx={{
            '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            ...props.sx,
        }}
    >
        <ModalContentWrapper overrideWidth={overrideWidth}>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                flex={1}
            >
                {title ? (
                    <Box>
                        <Typography variant="h5">{title}</Typography>
                    </Box>
                ) : null}
                {showCloseButton && typeof props.onClose !== 'undefined' ? (
                    <Box>
                        <IconButton
                            onClick={() => props.onClose?.({}, 'backdropClick')}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ) : null}
            </Box>
            <Box mt={2} flex={1} overflow="auto">
                {children}
            </Box>
        </ModalContentWrapper>
    </Modal>
);

export default CustomModal;
