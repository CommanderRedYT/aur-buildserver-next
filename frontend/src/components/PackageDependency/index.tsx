import type { FC } from 'react';
import React from 'react';

import type { PackageType } from '@/app/(main)/discover/_components/DiscoverPackageDetailsModal';

import { aurPackageUrl, packageUrl } from '@/constants/urls';

import type { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';

interface PackageDependencyProps {
    packageName: string;
    isAur: boolean;
    theme: Theme;
    type: PackageType;
}

const typeMap: Record<PackageType, string> = {
    Depends: 'Depends',
    MakeDepends: 'Make',
    OptDepends: 'Optional',
    CheckDepends: 'Check',
};

const PackageDependency: FC<PackageDependencyProps> = ({
    packageName,
    isAur,
    theme,
    type,
}) => (
    <Typography variant="body2" color="primary">
        <a
            href={isAur ? aurPackageUrl(packageName) : packageUrl(packageName)}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit' }}
        >
            {packageName}
            {type !== 'Depends' ? ` (${typeMap[type]})` : ''}
        </a>
        {isAur ? (
            <sup
                style={{
                    color: theme.palette.text.secondary,
                }}
            >
                <i>aur</i>
            </sup>
        ) : null}
    </Typography>
);

export default PackageDependency;
