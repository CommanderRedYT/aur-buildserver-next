import type { FC } from 'react';

import { useSnackbar } from 'notistack';

import type { TypeOfArrayItem } from '@/types';

import addPackageToPackageList from '@/lib/api/addPackageToPackageList';
import type { SearchPackageReturnType } from '@/lib/fetcher';
import stringAvatar from '@/lib/stringAvatar';

import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

export interface DiscoverPackagesAurListProps {
    pkg: TypeOfArrayItem<SearchPackageReturnType['results']>;
    isKnownPackage: boolean;
    onClick: () => void;
    updateKnownPackages: () => void;
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

const DiscoverPackagesListItem: FC<DiscoverPackagesAurListProps> = ({
    pkg,
    isKnownPackage,
    onClick,
    updateKnownPackages,
}) => {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <StyledCard elevation={0}>
            <CardHeader
                title={pkg.Name}
                avatar={<Avatar {...stringAvatar(pkg.Maintainer)} />}
                subheader={pkg.Maintainer}
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
                    {pkg.Description}
                </Typography>
            </CardContent>
            <CardActions>
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
            </CardActions>
        </StyledCard>
    );
};

export default DiscoverPackagesListItem;
