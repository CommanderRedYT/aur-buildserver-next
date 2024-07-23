import { prisma } from '@/database/db';

const markRunningAsFailed = async (): Promise<void> => {
    console.log('Marking running builds as failed');

    await prisma.aurPackageBuild.updateMany({
        where: {
            running: true,
            finishedAt: null,
        },
        data: {
            running: false,
            success: false,
        },
    });

    console.log('Deleting unfinished builds');

    const result = await prisma.aurPackageBuild.deleteMany({
        where: {
            running: false,
            finishedAt: null,
            exitCode: null,
        },
    });

    console.log('Deleted', result.count, 'unfinished builds');
};

export default markRunningAsFailed;
