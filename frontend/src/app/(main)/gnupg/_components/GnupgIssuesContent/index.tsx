'use client';

import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import type { GnupgData } from '@/lib/api/listGnupgIssues';
import listGnupgIssues from '@/lib/api/listGnupgIssues';
import trustGpgKey from '@/lib/api/trustGpgKey';

import FailIcon from '@mui/icons-material/Cancel';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

export interface GnupgIssuesContentProps {
    initialGnupgIssues: GnupgData | null;
}

const GnupgIssuesContent: FC<GnupgIssuesContentProps> = ({
    initialGnupgIssues,
}) => {
    const [gnupgData, setGnupgData] = useState<GnupgData>(initialGnupgIssues);

    const fetchGnupgIssues = async (): Promise<void> => {
        try {
            const [data] = await listGnupgIssues();

            if (data) {
                setGnupgData(data);
            }
        } catch (e) {
            console.error('failed to fetch issues', e);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            await fetchGnupgIssues();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box display="flex" flexWrap="wrap" gap={2}>
            {gnupgData?.map(data => (
                <Card sx={{ maxWidth: 300 }} key={data.id}>
                    <CardHeader
                        title={data.keyId}
                        avatar={
                            data.accepted ? (
                                <SuccessIcon color="success" />
                            ) : (
                                <FailIcon color="error" />
                            )
                        }
                    />
                    <CardContent>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            onClick={async () => {
                                await trustGpgKey(data.keyId);
                                await fetchGnupgIssues();
                            }}
                        >
                            Accept
                        </Button>
                    </CardActions>
                </Card>
            ))}
            {!gnupgData || gnupgData?.length === 0 ? (
                <Box>
                    <Typography>
                        There are no GnuPG keys that need to be accepted.
                    </Typography>
                </Box>
            ) : null}
        </Box>
    );
};

export default GnupgIssuesContent;
