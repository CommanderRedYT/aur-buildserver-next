import type { FC } from 'react';

import type { TypeOfArrayItem } from '@/types';

import type { KnownPackages } from '@/content/KnownPackagesPage';
import stringAvatar from '@/lib/stringAvatar';

import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    styled,
    Typography,
} from '@mui/material';

export interface KnownPackagesListItemProps {
    pkg: TypeOfArrayItem<KnownPackages>;
    onClick: () => void;
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
    onClick,
}) => {
    const foo = 'bar';

    return (
        <StyledCard elevation={0}>
            <CardHeader
                title={pkg.name}
                avatar={<Avatar {...stringAvatar(pkg.maintainer)} />}
                subheader={pkg.maintainer}
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
};
export default KnownPackagesListItem;
