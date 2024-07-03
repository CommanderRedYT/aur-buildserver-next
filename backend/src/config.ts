import type { BackendConfig } from './types/config';

const defaultConfig: BackendConfig = {
    listenPort: 5768,
    listenHost: '0.0.0.0',
};

const config: BackendConfig = {
    listenPort: parseInt(process.env.BACKEND_LISTEN_PORT ?? '', 10) || defaultConfig.listenPort,
    listenHost: process.env.BACKEND_LISTEN_HOST ?? defaultConfig.listenHost,
};

export default config;
