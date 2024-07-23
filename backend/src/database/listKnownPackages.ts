import { prisma } from '@/database/db';
import type { ApiResponseType } from '@/helper/api';

export type ListKnownPackages = () => Promise<ApiResponseType<'/api/packages/list'>>;

const listKnownPackages: ListKnownPackages = async () => {
    const data = await prisma.aurPackage.findMany({
        select: {
            id: true,
            packageId: true,
            lastModifiedDatabaseEntry: true,

            // metadata
            name: true,
            description: true,
            packageBaseId: true,
            packageBase: true,
            maintainer: true,
            votes: true,
            popularity: true,
            firstSubmitted: true,
            lastModified: true,
            flaggedOutOfDate: true,
            currentVersion: true,
            urlPath: true,
            url: true,

            dependencies: {
                select: {
                    packageName: true,
                },
                where: {
                    isAur: true,
                },
                distinct: ['packageName'],
            },
        },
    });

    return data.map((i) => ({
        ...i,
        lastModifiedDatabaseEntry: i.lastModifiedDatabaseEntry.toISOString(),
        firstSubmitted: i.firstSubmitted.toISOString(),
        lastModified: i.lastModified.toISOString(),
        dependencies: i.dependencies.map((dep) => dep.packageName),
    }));
};

export default listKnownPackages;
