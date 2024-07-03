import { promises as fs } from 'fs';
import path from 'path';

import type { CacheOptions } from '@/types/cache';

const cacheDir = './data/cache';

async function ensureCacheDir(): Promise<void> {
    try {
        await fs.mkdir(cacheDir);
    } catch (e) {
        if ((e as { code: string }).code !== 'EEXIST') {
            throw e;
        }
    }
}

async function cache<T>(fn: () => T, options: CacheOptions): Promise<T> {
    await ensureCacheDir();

    const cachePath = path.join(cacheDir, options.cacheKey);

    try {
        const stats = await fs.stat(cachePath);
        const now = Date.now();

        if (now - stats.mtime.getTime() < options.ttl) {
            const data = await fs.readFile(cachePath, 'utf-8');

            return JSON.parse(data);
        }
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            console.error('failed to read cache', e);
        }
    }

    try {
        const data = await fn();

        await fs.writeFile(cachePath, JSON.stringify(data), 'utf-8');

        return data;
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            console.error('failed to fetch data or write cache', e);
        }

        throw e;
    }
}

export default cache;
