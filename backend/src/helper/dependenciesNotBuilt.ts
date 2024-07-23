import { prisma } from '@/database/db';

const dependenciesNotBuilt = async (dependencies: string[]): Promise<string[]> => {
    const builtPackages = await prisma.aurPackageBuild.findMany({
        where: {
            package: {
                name: {
                    in: dependencies,
                },
            },
            success: true,
            running: false,
        },
        select: {
            package: {
                select: {
                    name: true,
                },
            },
        },
    });

    const builtPackageNames = builtPackages.map((pkg) => pkg.package.name);

    return dependencies.filter((dep) => !builtPackageNames.includes(dep));
};

export default dependenciesNotBuilt;
