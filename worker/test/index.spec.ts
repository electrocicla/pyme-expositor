import { describe, it, expect } from 'vitest';
import worker from '../src';

// These tests use the special `cloudflare:test` helpers which are only available
// when running with the Cloudflare worker test runner. When those helpers aren't
// available (e.g. running tests locally in Node), the tests will early-return
// and be considered skipped for local runs.

describe('Hello World user worker', () => {
	describe('request for /message', () => {
		it('/ responds with "Hello, World!" (unit style)', async () => {
			let cf: typeof import('cloudflare:test') | undefined;
			try {
				cf = await import('cloudflare:test');
			} catch {
				// Not running in Cloudflare worker test runner — skip this test locally.
				return;
			}

			const { env, createExecutionContext, waitOnExecutionContext } = cf;
			const request = new Request<unknown, IncomingRequestCfProperties>('http://example.com/message');
			// Create an empty context to pass to `worker.fetch()`.
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
			await waitOnExecutionContext(ctx);
			expect(await response.text()).toMatchInlineSnapshot(`"Hello, World!"`);
		});

		it('responds with "Hello, World!" (integration style)', async () => {
			let cf: typeof import('cloudflare:test') | undefined;
			try {
				cf = await import('cloudflare:test');
			} catch {
				return;
			}

			const { SELF } = cf;
			const request = new Request('http://example.com/message');
			const response = await SELF.fetch(request);
			expect(await response.text()).toMatchInlineSnapshot(`"Hello, World!"`);
		});
	});

	describe('request for /random', () => {
		it('/ responds with a random UUID (unit style)', async () => {
			let cf: typeof import('cloudflare:test') | undefined;
			try {
				cf = await import('cloudflare:test');
			} catch {
				return;
			}

			const { env, createExecutionContext, waitOnExecutionContext } = cf;
			const request = new Request<unknown, IncomingRequestCfProperties>('http://example.com/random');
			// Create an empty context to pass to `worker.fetch()`.
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
			await waitOnExecutionContext(ctx);
			expect(await response.text()).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
		});

		it('responds with a random UUID (integration style)', async () => {
			let cf: typeof import('cloudflare:test') | undefined;
			try {
				cf = await import('cloudflare:test');
			} catch {
				return;
			}

			const { SELF } = cf;
			const request = new Request('http://example.com/random');
			const response = await SELF.fetch(request);
			expect(await response.text()).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
		});
	});
});
