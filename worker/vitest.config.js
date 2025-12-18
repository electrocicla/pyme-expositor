import { defineConfig } from 'vitest/config';

// Default to Node environment for test runs on developer machines (especially Windows).
let config = defineConfig({ test: { environment: 'node' } });

if (process.platform !== 'win32') {
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
		// ignore and keep node-based config
	}
}

export default config;
