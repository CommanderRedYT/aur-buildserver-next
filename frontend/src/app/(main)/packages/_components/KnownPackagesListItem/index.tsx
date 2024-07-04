import type { FC } from 'react';
import React from 'react';

import type { KnownPackagesDataItem } from '@/app/(main)/packages/page';

import stringAvatar from '@/lib/stringAvatar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    styled,
    Typography,
} from '@mui/material';

export interface KnownPackagesListItemProps {
    pkg: KnownPackagesDataItem;
    onClick: () => void;
    onOptionsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.shape.borderRadius * 4,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 1,
}));

const KnownPackagesListItem: FC<KnownPackagesListItemProps> = ({
    pkg,
    onOptionsClick,
}) => (
    <StyledCard elevation={0}>
        <CardHeader
            title={pkg.name}
            avatar={<Avatar {...stringAvatar(pkg.maintainer)} />}
            subheader={pkg.maintainer}
            action={
                <IconButton onClick={onOptionsClick}>
                    <MoreVertIcon />
                </IconButton>
            }
            sx={{ whiteSpace: 'normal' }}
        />
        <CardContent
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                paddingTop: 0,
                paddingBottom: 0,
            }}
        >
            <Typography
                variant="body2"
                color="textSecondary"
                paragraph
                sx={{ margin: 0 }}
            >
                {pkg.description}
            </Typography>
        </CardContent>
        {/* <CardActions>
                <Button
                    disabled={isKnownPackage}
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
                    size="small"
                    startIcon={<AddIcon />}
                >
                    {isKnownPackage
                        ? 'Already in package list'
                        : 'Add to package list'}
                </Button>
                <Button
                    onClick={onClick}
                    variant="contained"
                    size="small"
                    endIcon={<MoreVertIcon />}
                >
                    View more
                </Button>
            </CardActions> */}
    </StyledCard>
);
export default KnownPackagesListItem;
