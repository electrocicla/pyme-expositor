# Expositor - Media Showcase Platform

Una aplicación moderna y responsive para exponer y gestionar colecciones de medios (imágenes y videos). Construida con React, TypeScript, Tailwind CSS y desplegada en Cloudflare Workers.

## 🚀 Características

- **Responsive Design**: Adaptable automáticamente a desktop, tablet y mobile
- **Dark Mode**: Tema oscuro/claro con preferencias del sistema
- **Media Management**: Upload, editar y eliminar imágenes y videos
- **Authentication**: Sistema de login seguro con tokens JWT
- **Storage**: Integración con Cloudflare R2 para almacenamiento
# PyME Expositor

A lightweight editor + showcase web app for small businesses and creators. The app includes a React + TypeScript frontend (Vite), and a Cloudflare Workers backend (Hono) using D1 for structured data and R2 for media storage.

This repository contains the frontend app and the Worker source under the `worker/` directory.

## Key features
- Draft / Publish workflow for site configuration
- Media management (upload, reorder, delete) backed by R2
- JWT-based admin authentication for protected endpoints
- Vite + React + TypeScript development stack

## Quick start (development)

Prerequisites
- Node.js 16+ (recommended)
- pnpm
- Cloudflare account (for D1, R2, Workers, Pages)
- Wrangler CLI (for Worker/D1 operations)

Install dependencies

```powershell
pnpm install
```

Run frontend dev server

```powershell
pnpm run dev
```

Run the worker locally (in a second terminal)

```powershell
cd worker
pnpm install
pnpm run dev
```

The frontend proxies `/api/*` to the local Worker in development.

## Build & deploy

Build the frontend

```powershell
pnpm run build
```

Deploy the frontend to Cloudflare Pages and the Worker (there are npm scripts):

```powershell
pnpm run deploy:pages   # build and deploy Pages
pnpm run deploy:worker  # deploy the Worker (from worker/)
# or run full deploy
pnpm run deploy
```

## Useful scripts (from `package.json`)
- `pnpm run dev` — start frontend dev server
- `pnpm run build` — typecheck and build frontend
- `pnpm run typecheck` — run TypeScript type checks
- `pnpm run deploy:pages` — build + deploy Pages
- `pnpm run deploy:worker` — deploy Worker
- `pnpm run deploy` — full deploy (Pages + Worker)

## Project layout

```
.
├── src/                # Frontend source (React + TS)
├── worker/             # Worker source, schema.sql, wrangler.jsonc
└── public/             # Static assets
```

## Configuration notes
- Worker config and bindings are in `worker/wrangler.jsonc`.
- Set `JWT_SECRET` and other sensitive values in Cloudflare dashboard or secure env.
- Initialize D1 schema with `wrangler d1 execute expositor-db --file worker/schema.sql`.

## API (high level)
- `GET /api/media` — list public media
- `GET /api/config` — get published config (landing)
- `GET /api/config/draft` — get draft config (editor)
- `POST /api/config` — save draft (requires auth)
- `POST /api/config/publish` — publish draft to public (requires auth)

See `worker/src/index.ts` for full endpoint details.

## License
This project is licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). See the `LICENSE` file for details.

If you are the project owner and want a different license for code (e.g. MIT), update the `LICENSE` and README accordingly before publishing.

## Contributing
- Fork the repo, create a feature branch, and open a pull request.

## Support
Open an issue after creating the GitHub repository and link it here.

---

Last updated: 2025-11-28
```bash
