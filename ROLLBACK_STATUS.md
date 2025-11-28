# Rollback Status - November 28, 2025

## Current Deployment Status

### ✅ Frontend (Cloudflare Pages)
- **Working URL**: https://fe4a226b.pyme-expositor.pages.dev
- **Commit**: dab1589 (production-ready-eslint-fixes branch)
- **Deployed**: 17 hours ago
- **Status**: Rolled back and tested

### ✅ Backend API (Cloudflare Worker)
- **URL**: https://pyme-expositor-worker.electrocicla.workers.dev
- **Version ID**: 0cf02ded-8b13-435b-a9cf-eafce0ee82b2
- **Deployed**: 2025-11-27T22:03:47Z
- **Status**: Rolled back to match Pages version

## Why This Version?
- The most recent builds on `master` branch had issues with:
  - CORS configuration requiring updates
  - API endpoint routing changes
  - Frontend build caching on Pages public domain
- Rolled back to stable version from `production-ready-eslint-fixes` branch (dab1589)

## Next Steps to Use This Version Permanently
1. Deploy to `main` branch instead of `master` to make it production default
2. Or configure Pages project default branch settings

## Testing
- Pages URL: https://fe4a226b.pyme-expositor.pages.dev/login
- Password: `secretpassword`
- Should redirect to Editor after login

## To Deploy New Changes
1. Fix issues on `master` branch
2. Run: `pnpm run deploy:pages` (deploy to Pages)
3. Run: `pnpm run deploy:worker` (deploy to Worker)
4. Or: `pnpm run deploy` (deploy both)
