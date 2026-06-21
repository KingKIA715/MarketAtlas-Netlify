# MarketAtlas — Deployment Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Netlify CLI: `npm install -g netlify-cli`
- GitHub account (connected to Netlify)

## Accounts Required

| Service | URL | Used For |
|---------|-----|----------|
| GitHub | github.com | Repo hosting |
| Netlify | netlify.com | Hosting + Functions |
| MetalpriceAPI | metalpriceapi.com | Gold/Silver/Platinum |
| RapidAPI | rapidapi.com | Metals fallback + Fuel |
| Alpha Vantage | alphavantage.co | Stocks + Forex fallback |

## Quick Start

```bash
# 1. Unzip all 6 archives into project root
unzip marketatlas-core.zip
unzip marketatlas-ui.zip
unzip marketatlas-services.zip
unzip marketatlas-modules.zip
unzip marketatlas-tests.zip
unzip marketatlas-deploy.zip

# 2. Setup
chmod +x scripts/*.sh
./scripts/setup.sh

# 3. Add API keys
cp .env.example .env
# Edit .env with your keys

# 4. Dev server
npm run dev
# → http://localhost:3000
```

## Environment Variables

Create `.env` in project root:

```env
METALPRICE_API_KEY=your_metalpriceapi_key
RAPIDAPI_KEY=your_rapidapi_key
ALPHAVANTAGE_API_KEY=your_alphavantage_key
```

Or set in Netlify Dashboard → Site Settings → Environment Variables.

## Deploy Pipeline

```
dev → preview → validate → production
```

| Stage | Command | Trigger |
|-------|---------|---------|
| Dev | `npm run dev` | Local |
| Preview | `./scripts/deploy-preview.sh` | Manual |
| Validate | `./scripts/validate.sh` | Manual |
| Production | `./scripts/deploy-prod.sh` | Manual (requires "yes") |

## GitHub → Netlify Auto-Deploy

1. Push repo to GitHub
2. Netlify Dashboard → "Add new site" → "Import from Git"
3. Select repo, branch `main`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables in Netlify UI

## API Key Security

- **Never** commit `.env` to Git
- Server Actions + Netlify Functions read keys server-side only
- Client never sees API keys

## Free Tier Limits

| Provider | Limit | Strategy |
|----------|-------|----------|
| MetalpriceAPI | 100/day | 30m cache |
| Alpha Vantage | 5/min, 500/day | 15m cache, batch calls |
| Frankfurter | Unlimited | Primary forex (no key) |
| RapidAPI | Varies by endpoint | 60m cache, fallback only |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check Node 20+, `npm ci --legacy-peer-deps` |
| API timeout | Check keys in `.env` or Netlify dashboard |
| 500 on functions | Check `netlify functions:logs` |
| Lighthouse < 90 | Run `npm run build` then `npx lhci autorun` |
| Cache stale | Hit `/health` to check cache stats, restart dev server |

## Mobile App Conversion

This PWA-ready site can be wrapped as a mobile app using:
- **Capacitor** (Ionic): `npm install @capacitor/core @capacitor/cli`
- **Tauri**: For desktop + mobile (Rust-based)
- Or keep as responsive PWA with `manifest.json` + service worker
