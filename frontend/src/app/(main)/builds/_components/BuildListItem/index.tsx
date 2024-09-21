import type { FC } from 'react';
import React from 'react';

import CustomCard from '@/components/CustomCard';

import type { BuildDataItem } from '@/lib/api/getBuilds';
import { formatVersion } from '@/lib/format';

import FailIcon from '@mui/icons-material/Cancel';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import RunningIcon from '@mui/icons-material/HourglassEmpty';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';

export interface BuildListItemProps {
    build: BuildDataItem;
    onClick: () => void;
}

const BuildListItem: FC<BuildListItemProps> = ({ build, onClick }) => (
    <CustomCard elevation={0} onClick={onClick}>
        <CardHeader
            title={`${build.package.name} ${build.version.pkgver}-${build.version.pkgrel}`}
            avatar={
                build.running ? (
                    <RunningIcon color="info" />
                ) : (
                    <>
                        {build.success ? (
                            <SuccessIcon color="success" />
                        ) : (
                            <FailIcon color="error" />
                        )}
                    </>
                )
            }
            subheader={`Build-ID: ${build.id}`}
            sx={{ whiteSpace: 'normal' }}
        />
        <CardContent>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                <Chip
                    label={`Status: ${
                        build.running
                            ? 'Running'
                            : build.success
                              ? 'Success'
                              : 'Failed'
                    }`}
                    color={
                        build.running
                            ? 'info'
                            : build.success
                              ? 'success'
                              : 'error'
                    }
                />
                <Chip label={formatVersion(build.version)} color="primary" />
                <Chip label={`Started at: ${build.startedAt}`} />
            </Box>
        </CardContent>
    </CustomCard>
);

export default BuildListItem;
