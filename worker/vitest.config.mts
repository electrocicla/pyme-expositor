import { defineConfig } from 'vitest/config';

// Try to use Cloudflare workers pool runner when available (CI or local dev with wrangler).
// Fall back to a simple Node environment when the Cloudflare runner isn't available
// so tests can run on developer machines or in environments without the runner.
let config;
// On Windows or when the Cloudflare pool runner is unavailable, fall back to Node environment.
if (process.platform === 'win32') {
    config = defineConfig({ test: { environment: 'node' } });
} else {
    try {
        const { defineWorkersConfig } = await import('@cloudflare/vitest-pool-workers/config');
        config = defineWorkersConfig({
            test: {
                poolOptions: {
                    workers: {
                        wrangler: { configPath: './wrangler.jsonc' },
                    },
                },
            },
        });
    } catch {
        // If the Cloudflare pool runner can't be resolved, default to Node environment for tests
        config = defineConfig({ test: { environment: 'node' } });
    }
}

export default config;
