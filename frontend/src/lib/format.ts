import type { components } from '@/generated/backend';

export const formatVersion = (
    version: components['schemas']['Version'],
): string => `${version.pkgver}-${version.pkgrel}`;
