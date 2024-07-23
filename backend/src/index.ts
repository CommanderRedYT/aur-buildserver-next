import config from '@/config';
import markRunningAsFailed from '@/database/markRunningAsFailed';
import { updatePacmanConfig } from '@/helper/pacman';
import programExists from '@/helper/programExists';
import { initializePacmanBuild } from '@/pacman/build';
import pacmanLock from '@/pacman/lock';
import { initializePacmanRepo } from '@/pacman/repo';
import taskQueue from '@/taskmanager';
import webApp from '@/web';

const requiredCommands = ['git', 'makepkg', 'repo-add', 'sudo', 'gpg', 'pacman', 'pacman-key', 'fuser'];

const main = async (): Promise<void> => {
    console.log('Main program started');

    const missingCommands = await Promise.all(requiredCommands.map(async (command) => {
        const exists = await programExists(command);

        return exists ? null : command;
    }));

    if (missingCommands.some((command) => command !== null)) {
        console.error('Missing required commands', missingCommands);
        process.exit(1);
    }

    await markRunningAsFailed();

    await initializePacmanRepo();
    await initializePacmanBuild();

    await updatePacmanConfig();

    pacmanLock.forceUnlock();

    await taskQueue.add('checkAurForUpdates', null);

    webApp.listen(config.listenPort, config.listenHost, () => {
        console.log(`Server listening at http://${config.listenHost}:${config.listenPort}`);
    });
};

main().catch((e) => {
    console.error('program error', e);
    process.exit(1);
});
