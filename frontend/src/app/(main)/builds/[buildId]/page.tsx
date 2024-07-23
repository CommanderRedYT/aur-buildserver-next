import { notFound } from 'next/navigation';

import type { FC } from 'react';

import BuildDetailsContent from '@/app/(main)/builds/[buildId]/_components/BuildDetailsContent';

import getBuildDetails from '@/lib/api/getBuildDetails';

export interface BuildDetailsPageProps {
    params: {
        buildId: string;
    };
}

const BuildDetailsPage: FC<BuildDetailsPageProps> = async ({ params }) => {
    const [details] = await getBuildDetails(params.buildId);

    if (!details) {
        return notFound();
    }

    return (
        <BuildDetailsContent
            initialDetails={details}
            buildId={params.buildId}
        />
    );
};

export default BuildDetailsPage;
