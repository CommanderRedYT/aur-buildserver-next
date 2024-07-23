import { exec } from 'child_process';
import { simpleGit } from 'simple-git';

export interface ParsedPackageVersion {
    pkgver: string;
    pkgrel: string;
    gitHash: string;
}

export interface ParsedPackageVersions {
    versions: Record<string, ParsedPackageVersion>;
    latestVersion?: ParsedPackageVersion;
}

export const extractVersionsFromGit = async (path: string): Promise<{ output: string; latestHash: string; }> => new Promise((resolve, reject) => {
    let latestHash = '';

    const git = simpleGit(path);

    git.revparse(['HEAD'], (error, result) => {
        console.log('HEAD', result);
        if (error) {
            console.error('Failed to get latest hash', error);
            reject(error);
        } else {
            latestHash = result.trim();

            exec('git grep -P "(pkgver = )|(pkgrel = )" $(git rev-list --all)', {
                cwd: path,
            }, (err, stdout, stderr) => {
                if (err) {
                    console.error('Failed to extract versions from git', err, stderr);
                    reject(err);
                } else {
                    resolve({
                        output: stdout,
                        latestHash,
                    });
                }
            });
        }
    });
});

export const parseVersionsFromGit = async (path: string): Promise<ParsedPackageVersions> => {
    const regex = /(?<hash>\b[0-9a-f]{5,40}\b):.*:.*(?<type>pkgver|pkgrel)\s=\s(?<value>.*)/;

    const { output, latestHash } = await extractVersionsFromGit(path);

    const lines = output.split('\n').filter(Boolean).map((line) => line.trim().replace(/\t/g, ''));

    // reverse the lines to get the oldest version first
    const linesReversed = lines.slice().reverse();

    const parsed = linesReversed.map((line) => {
        const match = regex.exec(line);

        if (match?.groups) {
            return match.groups;
        }

        return null;
    }).filter(Boolean) as { hash: string; type: string; value: string }[];

    const versions: ParsedPackageVersions['versions'] = {};

    for (const data of parsed) {
        if (!versions[data.hash]) {
            versions[data.hash] = {
                pkgver: '',
                pkgrel: '',
                gitHash: data.hash,
            };
        }

        if (data.type === 'pkgver') {
            versions[data.hash]!.pkgver = data.value;
        } else if (data.type === 'pkgrel') {
            versions[data.hash]!.pkgrel = data.value;
        }
    }

    const parsedAndFiltered: ParsedPackageVersions['versions'] = {};

    for (const [, { pkgver, pkgrel, gitHash }] of Object.entries(versions)) {
        const key = `${pkgver}-${pkgrel}`;

        if (!parsedAndFiltered[key]) {
            parsedAndFiltered[key] = {
                pkgver,
                pkgrel,
                gitHash,
            };
        }

        // TODO: Implement better logging
        // console.debug('Duplicate version', gitHash, pkgver, pkgrel);
    }

    return {
        versions: parsedAndFiltered,
        latestVersion: latestHash in versions ? versions[latestHash] : undefined,
    };
};
