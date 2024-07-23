'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';

import hljs from 'highlight.js';

import 'highlight.js/styles/github-dark.css';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';

export interface PkgbuildViewerProps {
    pkgbuild: string | null;
}

const StyledPre = styled('pre')(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 6,
    overflow: 'auto',
    margin: 0,
}));

const PkgbuildViewer: FC<PkgbuildViewerProps> = ({ pkgbuild }) => {
    const ref = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (pkgbuild && ref.current) {
            hljs.highlightBlock(ref.current);
        }
    }, [pkgbuild]);

    if (!pkgbuild) {
        return (
            <Typography variant="body2" color="textSecondary">
                No PKGBUILD available
            </Typography>
        );
    }

    return (
        <StyledPre ref={ref} className="bash">
            <code style={{ padding: 16 }}>{pkgbuild}</code>
        </StyledPre>
    );
};

export default PkgbuildViewer;
