import type { FC } from 'react';
import React from 'react';

import CustomCard from '@/components/CustomCard';

import type { KnownPackagesDataItem } from '@/lib/api/getKnownPackages';
import stringAvatar from '@/lib/stringAvatar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export interface KnownPackagesListItemProps {
    pkg: KnownPackagesDataItem;
    onClick: () => void;
    onOptionsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const KnownPackagesListItem: FC<KnownPackagesListItemProps> = ({
    pkg,
    onOptionsClick,
}) => (
    <CustomCard elevation={0}>
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
                component="p"
                paragraph
                sx={{ margin: 0 }}
            >
                {pkg.description}
            </Typography>
        </CardContent>
    </CustomCard>
);
export default KnownPackagesListItem;
