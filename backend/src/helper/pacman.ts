import { exec } from 'child_process';

import config from '@/config';
import { stripPkgName } from '@/helper/aur';

// eslint-disable-next-line import/prefer-default-export
export const packageIsInstalled = async (packageName: string): Promise<boolean> => {
    const strippedPkgName = stripPkgName(packageName);

    return new Promise<boolean>((resolve) => {
        exec(`pacman -Qi ${strippedPkgName}`, (error) => {
            resolve(error === null);
        });
    });
};

export const packagesInstalled = async (packageNames: string[]): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {};

    for await (const packageName of packageNames) {
        results[packageName] = await packageIsInstalled(packageName);
    }

    return results;
};

export const packageNamesNotInstalled = async (packageNames: string[]): Promise<string[]> => {
    const packagesNotInstalled: Set<string> = new Set();

    for await (const packageName of packageNames) {
        if (!(await packageIsInstalled(packageName))) {
            packagesNotInstalled.add(packageName);
        }
    }

    return Array.from(packagesNotInstalled);
};

export const updatePacmanConfig = async (): Promise<void> => {
    // add this server in the pacman.conf. if the entry already exists, replace it with updated config
    const pacmanConf = `
    [aurnext]
    SigLevel = Optional TrustAll
    Include = /etc/pacman.d/aurnext
    `;

    const mirrorlist = `
    Server = http://localhost:${config.listenPort}/repo/
    `;

    const pacmanConfPath = '/etc/pacman.conf';
    const aurnextPath = '/etc/pacman.d/aurnext';

    const writeMirrorlistPromise = new Promise<void>((resolve, reject) => {
        exec(`sudo bash -c "echo \\"${mirrorlist}\\" > ${aurnextPath}"`, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

    await writeMirrorlistPromise;

    // check if aurnext entry exists in pacman.conf
    const pacmanConfExists = await new Promise<boolean>((resolve) => {
        exec(`grep -q 'aurnext' ${pacmanConfPath}`, (error) => {
            resolve(error === null);
        });
    });

    if (!pacmanConfExists) {
        // add aurnext entry to pacman.conf
        await new Promise<void>((resolve, reject) => {
            exec(`sudo bash -c "echo \\"${pacmanConf}\\" >> ${pacmanConfPath}"`, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
};
