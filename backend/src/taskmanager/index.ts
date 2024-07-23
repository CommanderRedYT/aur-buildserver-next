import type { DoneCallback, Job } from 'bull';
import Queue from 'bull';

import config from '@/config';
import buildAllPackages from '@/taskmanager/tasks/buildAllPackages';
import buildPackage from '@/taskmanager/tasks/buildPackage';
import checkAurForUpdates from '@/taskmanager/tasks/checkAurForUpdates';
import handleNewPackage from '@/taskmanager/tasks/handleNewPackage';

const taskQueue = new Queue('taskQueue', {
    redis: {
        host: config.redisHost,
        port: config.redisPort,
        lazyConnect: false,
    },
});

taskQueue.process('handleNewPackage', handleNewPackage);

taskQueue.process('checkAurForUpdates', checkAurForUpdates);

taskQueue.process('buildPackage', buildPackage);

taskQueue.process('buildAllPackages', buildAllPackages);

taskQueue.add('checkAurForUpdates', null, {
    repeat: {
        cron: '0 * * * *', // Every hour
    },
    removeOnComplete: false,
    removeOnFail: false,
});

taskQueue.on('error', (error) => {
    console.error('Task queue error', error);
});

taskQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed with error`, error);
});

taskQueue.on('progress', (job, progress) => {
    console.log(`Job ${job.id} is ${progress}% done`);
});

export type TaskFunction<T extends object | undefined = undefined> = (job: Job<T>, done: DoneCallback) => Promise<void>;

export default taskQueue;
