export const getPkgbuildUrl = (packageName: string): string => `https://aur.archlinux.org/cgit/aur.git/plain/PKGBUILD?h=${packageName}`;

export const getAurUrl = (packageName: string): string => `https://aur.archlinux.org/packages/${packageName}`;
