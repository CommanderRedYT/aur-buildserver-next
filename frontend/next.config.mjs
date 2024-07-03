const requiredEnv = ['CONFIG_API_URL'];

if (process.env.npm_lifecycle_event !== 'lint') {
    for (const env of requiredEnv) {
        if (!process.env[env]) {
            throw new Error(`Environment variable ${env} is required`);
        } else {
            console.log(`Successfully loaded environment variable ${env} with value ${process.env[env]}`);
        }
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compiler: process.env.NODE_ENV === 'production' ? {
        removeConsole: true,
    } : {},
    env: {
        CONFIG_API_URL: process.env.CONFIG_API_URL,
    },
    rewrites: async () => {
        return [
            {
                source: '/api/aur/:path*',
                destination: `${process.env.CONFIG_API_URL}/api/aur/:path*`,
            },
            {
                source: '/api/packages/:path*',
                destination: `${process.env.CONFIG_API_URL}/api/packages/:path*`,
            },
        ];
    },
    webpack: (config) => {
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        );

        config.module.rules.push(
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: [{ loader: '@svgr/webpack', options: { icon: true } }],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default nextConfig;
