import type { FC } from 'react';

import GnupgIssuesContent from '@/app/(main)/gnupg/_components/GnupgIssuesContent';

import listGnupgIssues from '@/lib/api/listGnupgIssues';

const GnupgPage: FC = async () => {
    const [gnupgIssues] = await listGnupgIssues();

    return <GnupgIssuesContent initialGnupgIssues={gnupgIssues} />;
};

export default GnupgPage;
