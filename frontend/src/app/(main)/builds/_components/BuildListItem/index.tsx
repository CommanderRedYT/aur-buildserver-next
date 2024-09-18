import type { FC } from 'react';
import React from 'react';

import CustomCard from '@/components/CustomCard';

import type { BuildDataItem } from '@/lib/api/getBuilds';

import FailIcon from '@mui/icons-material/Cancel';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import RunningIcon from '@mui/icons-material/HourglassEmpty';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

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
            <pre style={{ textWrap: 'wrap' }}>
                {JSON.stringify(build, null, 2)}
            </pre>
        </CardContent>
    </CustomCard>
);

export default BuildListItem;
