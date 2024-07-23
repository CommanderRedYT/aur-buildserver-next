import { exec, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import type { SimpleGitProgressEvent } from 'simple-git';
import { ResetMode, simpleGit } from 'simple-git';

import { prisma } from '@/database/db';
import exists from '@/helper/exists';
import type { UnlockFunction } from '@/helper/processlock';
import pacmanLock from '@/pacman/lock';
import { GNUPGHOME, GPG_PASSPHRASE } from '@/pacman/repo';

export const buildBaseDirectory = './data/build';

export const getGitRepo = (packageName: string): string => `https://aur.archlinux.org/${packageName}.git`;

export const getPackageDirectory = (packageName: string): string => path.join(buildBaseDirectory, packageName);

export const getBuildLogPath = (buildId: string): string => path.join(buildBaseDirectory, `${buildId}.log`);

export const appendToBuildLog = async (buildId: string, data: string, type: 'stdout' | 'stderr' = 'stdout'): Promise<void> => {
    // write log file as json
    const logPath = getBuildLogPath(buildId);

    // remove the last newline at the end of the string
    let dataCopy = data;

    if (dataCopy.endsWith('\n')) {
        dataCopy = dataCopy.slice(0, -1);
    }

    const obj = {
        timestamp: (new Date()).toISOString(),
        data: dataCopy,
        type,
    };

    await fs.appendFile(logPath, `${JSON.stringify(obj)}\n`, {
        encoding: 'utf-8',
    });
};

export const initializePacmanBuild = async (): Promise<void> => {
    try {
        await fs.mkdir(buildBaseDirectory, { recursive: true });
    } catch (e) {
        console.error('Failed to create pacman build base directory', e);
        if ((e as { code: string }).code !== 'EEXIST') {
            throw e;
        }
    }
};

export const clonePackage = async (packageName: string, onProgress: ((progress: number) => void)): Promise<string> => {
    console.log(`Cloning package ${packageName}`);
    const git = simpleGit(buildBaseDirectory, {
        progress(data: SimpleGitProgressEvent) {
            onProgress(data.progress);
        },
    });

    const gitPath = path.join(buildBaseDirectory, packageName);

    if (await exists(gitPath)) {
        throw new Error('Package already exists');
    }

    await git.clone(getGitRepo(packageName), packageName);

    return getPackageDirectory(packageName);
};

export const updatePackage = async (packageName: string): Promise<string> => {
    console.log(`Updating package ${packageName}`);
    const dir = getPackageDirectory(packageName);

    if (!await exists(dir)) {
        return clonePackage(packageName, () => { /* empty */ });
    }

    const git = simpleGit(dir);

    // reset hard to discard any local changes
    await git.reset(ResetMode.HARD);

    // pull changes from remote
    await git.pull();

    // clean untracked files
    await git.clean('f');

    return dir;
};

export const prepareBuild = async (buildId: string): Promise<boolean> => new Promise<boolean>((resolve, reject) => {
    console.log('Preparing build');
    pacmanLock.tryToLock(1500, `prepare_build_${buildId}`).catch((e) => {
        reject(e);
    }).then((unlock) => {
        if (!unlock) {
            reject(new Error('Failed to lock pacman'));
            return;
        }

        const pacman = spawn('sudo', ['pacman', '-Sy', '--noconfirm', '--color=always'], {
            stdio: 'pipe',
            env: {
                ...process.env,
                GNUPGHOME,
            },
            shell: true,
        });

        pacman.stdout.on('data', async (data) => {
            console.log('stdout', data.toString());
            await appendToBuildLog(buildId, data.toString(), 'stdout');
        });

        pacman.stderr.on('data', async (data) => {
            console.error('stderr', data.toString());
            await appendToBuildLog(buildId, data.toString(), 'stderr');
        });

        pacman.on('close', (code) => {
            if (code === 0) {
                console.log('Updated packages');
                unlock();
                resolve(true);
            } else {
                console.error('Failed to update packages', code);
                unlock();
                reject(new Error('Failed to update packages'));
            }
        });

        pacman.on('error', (error) => {
            console.error('Failed to spawn pacman', error);
            unlock();
            reject(error);
        });
    });
});

export const handleMakepkgOutput = async (packageId: number, output: string, unlockFunction: UnlockFunction): Promise<void> => {
    // check for "unknown public key" in output. if so, call function foo(keyId: string): void

    const keyIdMatch = output.match(/unknown public key ([0-9A-Fa-f]+)/);

    if (keyIdMatch?.[1]) {
        try {
            await prisma.gnupgKeys.create({
                data: {
                    package: {
                        connect: {
                            packageId,
                        },
                    },
                    keyId: keyIdMatch[1],
                    accepted: false,
                },
            });
        } catch { /* empty */ } finally {
            await prisma.gnupgKeys.updateMany({
                where: {
                    packageId,
                    keyId: keyIdMatch[1],
                },
                data: {
                    accepted: false,
                },
            });
        }
    }

    // ==> Retrieving sources...
    const dependenciesFinishedRegex = /==> Finished making: (.*) \(.*\)/;

    const dependenciesFinished = output.match(dependenciesFinishedRegex);

    if (dependenciesFinished?.[1]) {
        unlockFunction();
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const executeBuild = (packageName: string, packageId: number, gitHash: string, buildId: string, setPid: ((pid: number) => void)): Promise<number> => new Promise<number>((resolve, reject) => {
    console.log('Executing build');
    pacmanLock.tryToLock(1500, `execute_build_${packageName}`).catch((e) => {
        reject(e);
    }).then((unlock) => {
        if (!unlock) {
            reject(new Error('Failed to lock pacman'));
            return;
        }
        console.log(`makepkg ${packageName}`);

        const makepkg = exec(`${GNUPGHOME} GPG_TTY=$(tty) makepkg -f -s --noconfirm -c --rmdeps --noprogressbar`, {
            cwd: getPackageDirectory(packageName),
        }, async (error, stdout, stderr) => {
            handleMakepkgOutput(packageId, stdout, unlock);
            handleMakepkgOutput(packageId, stderr, unlock);

            if (error) {
                console.error('Failed to build package', error);
                unlock();
                reject(error);
            } else {
                console.log('Built package');
                unlock();
                resolve(0);
            }
        });

        makepkg.stdout?.on('data', async (data) => {
            await appendToBuildLog(buildId, data.toString(), 'stdout');
        });

        makepkg.stderr?.on('data', async (data) => {
            await appendToBuildLog(buildId, data.toString(), 'stderr');
        });

        makepkg.on('exit', async (code) => {
            console.log('makepkg exited with code', code);
        });

        if (makepkg.pid) {
            setPid(makepkg.pid);
        }
    });
});

export const scanForArtifacts = async (packageName: string): Promise<string[]> => {
    const dir = getPackageDirectory(packageName);
    const files = await fs.readdir(dir);

    return files.filter((file) => file.endsWith('.pkg.tar.zst')).map((file) => path.join(dir, file));
};

export const signArtifact = async (artifact: string): Promise<void> => new Promise<void>((resolve, reject) => {
    exec(`${GNUPGHOME} GPG_TTY=$(tty) gpg --batch --yes --pinentry-mode loopback --passphrase ${GPG_PASSPHRASE} --detach-sign --no-armor --output ${artifact}.sig ${artifact}`, (error, stdout, stderr) => {
        if (stdout) {
            console.log('stdout', stdout);
        }
        if (stderr) {
            console.error('stderr', stderr);
        }

        if (error) {
            console.error('Failed to sign artifact', error);
            reject(error);
        } else {
            console.log('Signed artifact');
            resolve();
        }
    });
});

export const trustGpgKey = async (keyId: string): Promise<void> => new Promise<void>((resolve, reject) => {
    exec(`${GNUPGHOME} GPG_TTY=$(tty) gpg --recv-keys ${keyId}`, (error, stdout, stderr) => {
        if (stdout) {
            console.log('stdout', stdout);
        }
        if (stderr) {
            console.error('stderr', stderr);
        }

        if (error) {
            console.error('Failed to trust gpg key', error);
            reject(error);
        } else {
            console.log('Trusted gpg key');
            resolve();
        }
    });
});
