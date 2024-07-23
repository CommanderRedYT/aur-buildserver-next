import type { BackendConfig } from './types/config';

const defaultConfig: BackendConfig = {
    listenPort: 5768,
    listenHost: '0.0.0.0',
    redisHost: 'localhost',
    redisPort: 6379,
};

const config: BackendConfig = {
    listenPort: parseInt(process.env.BACKEND_LISTEN_PORT ?? '', 10) || defaultConfig.listenPort,
    listenHost: process.env.BACKEND_LISTEN_HOST ?? defaultConfig.listenHost,
    redisHost: process.env.BACKEND_REDIS_HOST ?? defaultConfig.redisHost,
    redisPort: parseInt(process.env.BACKEND_REDIS_PORT ?? '', 10) || defaultConfig.redisPort,
};

export default config;
