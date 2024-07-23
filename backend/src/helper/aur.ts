import fetcherApi from '@/aur/fetcher';
import cache from '@/cache';
import type { components } from '@/generated/aur';

const infoEndpoint = fetcherApi('/rpc/v5/info/{arg}').method('get').create();

export const stripPkgNameRegex = /(=|>|<|>=|<=).*/;

export const stripPkgName = (pkgName: string): string => pkgName.replace(stripPkgNameRegex, '');

export const existsInAur = async (pkgName: string): Promise<boolean> => {
    console.log('Checking if package exists in AUR', pkgName);

    if (!pkgName) {
        return false;
    }

    // remove required version from package name
    const strippedPkgName = stripPkgName(pkgName);

    return cache(async () => {
        const result = await infoEndpoint({
            arg: strippedPkgName,
        });

        console.log('AUR package exists', pkgName, result.ok, result.status);

        if (!result.ok || !result.data || !result.data.results) {
            return false;
        }

        return result.data.results.length > 0;
    }, {
        ttl: 1000 * 60 * 60,
        cacheKey: `aur-only-${strippedPkgName}`,
    });
};

export const getAurOnlyDependenciesFromMultiplePackageDetailed = async (packageDetailed?: components['schemas']['PackageDetailed'][]): Promise<string[]> => {
    if (!packageDetailed) {
        return [];
    }

    const packages: string[] = [];

    const extractPackages = async (pkg: components['schemas']['PackageDetailed']): Promise<string[]> => {
        const pkgs: Set<string> = new Set();

        await Promise.all([
            ...(pkg.Depends || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
            ...(pkg.MakeDepends || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
            ...(pkg.CheckDepends || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
            ...(pkg.OptDepends || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
            ...(pkg.Conflicts || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
            ...(pkg.Replaces || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
            ...(pkg.Provides || []).map(async (dep) => {
                if (await existsInAur(dep)) {
                    pkgs.add(dep);
                }
            }),
        ]);

        return Array.from(pkgs);
    };

    for await (const pkg of packageDetailed) {
        packages.push(...await extractPackages(pkg));
    }

    return packages;
};

export const getAurOnlyDependenciesFromPackageDetailed = async (packageDetailed?: components['schemas']['PackageDetailed']): Promise<string[]> => {
    if (!packageDetailed) {
        return [];
    }

    return getAurOnlyDependenciesFromMultiplePackageDetailed([packageDetailed]);
};
