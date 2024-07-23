import { exec } from 'child_process';
import fs from 'fs/promises';
import { existsSync } from 'node:fs';

import exists from '@/helper/exists';

export const pacmanRepoBaseDirectory = './data/repository';

export const repoName = 'aurnext';

export const repoDb = `${pacmanRepoBaseDirectory}/${repoName}.db.tar.gz`;

export const repoDbFile = `${pacmanRepoBaseDirectory}/${repoName}.db`;

export const repoFiles = `${pacmanRepoBaseDirectory}/${repoName}.files.tar.gz`;

export const repoFilesFile = `${pacmanRepoBaseDirectory}/${repoName}.files`;

export const getPackagePath = (packageName: string): string => `${pacmanRepoBaseDirectory}/${packageName}`;

export const getPackageSigPath = (packageName: string): string => `${pacmanRepoBaseDirectory}/${packageName}.sig`;

export const gnupgHome = '/app/data/gnupg';

export const GNUPGHOME = `GNUPGHOME=${gnupgHome}`;

export const GPG_PASSPHRASE = 'aur';

export const gpgTemplate = `Key-Type: RSA
Key-Length: 2048
Subkey-Type: RSA
Subkey-Length: 2048
Name-Real: AUR Buildserver Next
Name-Email: aur@buildserver
Name-Comment: AUR Buildserver Next
Expire-Date: 0
Passphrase: ${GPG_PASSPHRASE}
`;

export const signDatabase = async (file: string): Promise<void> => new Promise<void>((resolve, reject) => {
    exec(`${GNUPGHOME} gpg --batch --yes --pinentry-mode loopback --passphrase ${GPG_PASSPHRASE} --detach-sign --no-armor --output ${file}.sig ${file}`, (error) => {
        if (error) {
            console.error('Failed to sign database', error);
            reject(error);
        } else {
            console.log('Signed database');
            resolve();
        }
    });
});

export const getSigningKeyId = async (): Promise<string | null> => {
    let keyId: string | null = null;

    const keyIdPromise = new Promise<void>((resolve, reject) => {
        exec(`${GNUPGHOME} gpg --list-secret-keys --keyid-format LONG --with-colons`, (error, stdout) => {
            if (error) {
                console.error('Failed to get key id', error);
                reject(error);
            } else {
                if (stdout) {
                    // get the id in FPR
                    const keyIdMatch = stdout.match(/fpr:::::::::([A-Z0-9]+)/);
                    if (keyIdMatch && keyIdMatch[1]) {
                        // eslint-disable-next-line prefer-destructuring
                        keyId = keyIdMatch[1];
                    }
                }
                resolve();
            }
        });
    });

    await keyIdPromise;

    return keyId;
};

export const unlockPacmanDatabaseSafe = async (): Promise<void> => new Promise<void>((resolve, reject) => {
    // run fuser /var/lib/pacman/db.lck to see if pacman is running. If it is, wait for it to finish. If it's not, remove the lock file
    exists('/var/lib/pacman/db.lck')
        .then((fileExists) => {
            if (!fileExists) {
                console.log('Pacman lock file does not exist, skipping check and removal');
                resolve();

                return;
            }

            exec('fuser /var/lib/pacman/db.lck', (error, stdout) => {
                if (stdout) {
                    console.log('Pacman is running, waiting for it to finish');
                    setTimeout(() => {
                        unlockPacmanDatabaseSafe()
                            .then(resolve)
                            .catch(reject);
                    }, 1000);
                } else {
                    console.log('Pacman is not running, removing lock file');
                    exec('sudo rm /var/lib/pacman/db.lck', (innerError) => {
                        if (innerError) {
                            console.error('Failed to remove lock file', innerError);
                            reject(innerError);
                        } else {
                            console.log('Removed lock file');
                            resolve();
                        }
                    });
                }
            });
        });
});

export const initializePacmanRepo = async (): Promise<void> => {
    try {
        await fs.mkdir(pacmanRepoBaseDirectory, { recursive: true });

        if (!existsSync(repoDb)) {
            await fs.writeFile(repoDb, '');
        }

        if (!existsSync(repoDbFile)) {
            await fs.writeFile(repoDbFile, '');
        }

        if (!existsSync(repoFiles)) {
            await fs.writeFile(repoFiles, '');
        }

        if (!existsSync(repoFilesFile)) {
            await fs.writeFile(repoFilesFile, '');
        }

        if (!existsSync(gnupgHome)) {
            await fs.mkdir(gnupgHome, { recursive: true });
            await fs.chmod(gnupgHome, 0o700);
        }

        await unlockPacmanDatabaseSafe();

        const gpgIsSetup = existsSync('./data/repo.key');

        const repoAddPromise = new Promise<void>((resolve, reject) => {
            exec(`repo-add ${repoDb}`, (error) => {
                if (error) {
                    console.error('Failed to create pacman repo', error);
                    reject(error);
                } else {
                    console.log('Created pacman repo');
                    resolve();
                }
            });
        });

        await repoAddPromise;

        if (gpgIsSetup) {
            console.log('GPG is already setup, skipping setup');
            return;
        }

        console.log('Setting up GPG');

        if (!existsSync('./data/gnupg_template')) {
            await fs.writeFile('./data/gnupg_template', gpgTemplate);
        }

        const setupSigningPromise = new Promise<void>((resolve, reject) => {
            // generate a signing key
            exec(`${GNUPGHOME} GPG_TTY=$(tty) gpg --batch --gen-key ./data/gnupg_template`, (error) => {
                if (error) {
                    console.error('Failed to create signing key', error);
                    reject(error);
                } else {
                    console.log('Created signing key');
                    resolve();
                }
            });
        });

        await setupSigningPromise;

        const exportSigningKeyPromise = new Promise<void>((resolve, reject) => {
            exec(`${GNUPGHOME} gpg --export --armor > ./data/repo.key`, (error) => {
                if (error) {
                    console.error('Failed to export signing key', error);
                    reject(error);
                } else {
                    console.log('Exported signing key');
                    resolve();
                }
            });
        });

        await exportSigningKeyPromise;

        const keyId = await getSigningKeyId();

        if (!keyId) {
            throw new Error('Failed to setup signing key');
        }

        const initializePacmanKeyring = new Promise<void>((resolve, reject) => {
            exec(`${GNUPGHOME} sudo pacman-key --init`, (error) => {
                if (error) {
                    console.error('Failed to init pacman-key', error);
                    reject(error);
                } else {
                    console.log('Successfully initialized pacman-key');
                    resolve();
                }
            });
        });

        await initializePacmanKeyring;

        const addKeyToPacmanPromise = new Promise<void>((resolve, reject) => {
            exec(`${GNUPGHOME} sudo pacman-key --add ./data/repo.key`, (error) => {
                if (error) {
                    console.error('Failed to add key to pacman', error);
                    reject(error);
                } else {
                    console.log('Added key to pacman');
                    resolve();
                }
            });
        });

        await addKeyToPacmanPromise;

        const trustKeyPromise = new Promise<void>((resolve, reject) => {
            exec(`${GNUPGHOME} sudo pacman-key --lsign-key ${keyId}`, (error) => {
                if (error) {
                    console.error('Failed to trust key', error);
                    reject(error);
                } else {
                    console.log('Trusted key');
                    resolve();
                }
            });
        });

        await trustKeyPromise;

        const exportKeyToKeyserverPromise = new Promise<void>((resolve, reject) => {
            exec(`${GNUPGHOME} gpg --send-keys ${keyId}`, (error) => {
                if (error) {
                    console.error('Failed to export key to keyserver', error);
                    reject(error);
                } else {
                    console.log('Exported key to keyserver');
                    resolve();
                }
            });
        });

        await exportKeyToKeyserverPromise;

        await signDatabase(repoDb);
        await signDatabase(repoDbFile);
    } catch (e) {
        console.error('Failed to create pacman repo base directory', e);
        if ((e as { code: string }).code !== 'EEXIST') {
            throw e;
        }
    }
};

export const addPackage = async (pathToPackage: string): Promise<void> => new Promise<void>((resolve, reject) => {
    exec(`${GNUPGHOME} repo-add -s -v ${repoDb} ${pathToPackage}`, (error) => {
        if (error) {
            console.error('Failed to add package to repo', error);
            reject(error);
        } else {
            console.log('Added package to repo');
            resolve();
        }
    });
});

export const removePackageVersion = async (): Promise<void> => {};
