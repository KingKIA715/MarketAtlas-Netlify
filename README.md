# MarketAtlas — Global Financial Hub

Real-time metals, stocks, forex, and energy prices for everyone. Built with Next.js, deployed on Netlify, zero paid services.

## Quick Start

```bash
# 1. Clone / unzip all 6 archives into project root
# 2. Setup
cp .env.example .env        # Add your API keys
chmod +x scripts/*.sh
./scripts/setup.sh          # Install, type-check, test, build

# 3. Dev server
npm run dev                 # → http://localhost:3000
```

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS 3 |
| State | Zustand (persist middleware) |
| Charts | Recharts (dynamic import) |
| Data Fetching | SWR + Server Actions |
| Hosting | Netlify (static export + functions) |
| Testing | Vitest + jsdom + MSW |

## Architecture

```
Frontend (Next.js App Router)
├── app/                    # Routes: /, /precious-metals, /stocks, /gasoline, /currencies
├── components/
│   ├── shared/             # Card, Chart, Table, Skeleton, ErrorState, LiveBadge
│   └── modules/            # MetalCard, StockCard, FuelCard, FXCard
├── stores/                 # global (country, currency) + feature (metals, stocks, fuel, forex)
├── hooks/                  # useCountry, useCurrency, useModuleData
└── services/               # Server Actions (Zod-validated)

Backend (Netlify Functions)
├── netlify/functions/
│   ├── api.ts              # /api/metals, /stocks, /fuel, /forex
│   └── health.ts           # /health (status + cache stats)
├── cache/                  # In-memory TTL cache
└── providers/              # MetalpriceAPI, AlphaVantage, Frankfurter, RapidAPI
```

## Data Flow

```
UI → Store → Server Action → Provider Router → Cache → Fallback → Response
```

## Provider Strategy

| Module | Primary | Fallback | Fallback 2 | Cache TTL |
|--------|---------|----------|------------|-----------|
| Metals | MetalpriceAPI | RapidAPI | Cache | 30m |
| Stocks | Alpha Vantage | Cache | — | 15m |
| Forex | Frankfurter | AlphaVantage | Cache | 5m |
| Fuel | RapidAPI | Cache | — | 60m |
| Historical | AlphaVantage | Cache | — | 24h |

**Fail Rules:** timeout=5s, retry=1, circuit_breaker=true, serve_stale=true

## Routes

| Route | Content |
|-------|---------|
| `/` | Dashboard with 6 preview cards |
| `/precious-metals/` | Gold (gram, sovereign, 24/22/18K), Silver, Platinum |
| `/stocks/` | Indices, Top Gainers, Top Losers |
| `/gasoline/` | Crude, Petrol, Diesel, LPG Commercial/Domestic |
| `/currencies/` | Top 10 rates, search, converter |

## Environment Variables

Create `.env` in project root (already in `.gitignore`):

```env
METALPRICE_API_KEY=your_metalpriceapi_key
RAPIDAPI_KEY=your_rapidapi_key
ALPHAVANTAGE_API_KEY=your_alphavantage_key
```

**Security:** API keys are server-only. Client never sees them.

## Free Tier Limits

| Provider | Limit | Strategy |
|----------|-------|----------|
| MetalpriceAPI | 100/day | 30m cache |
| Alpha Vantage | 5/min, 500/day | 15m cache, batch calls |
| Frankfurter | Unlimited | Primary forex (no key) |
| RapidAPI | Varies | 60m cache, fallback only |

## Testing

```bash
npm run test          # Unit tests
npm run test -- --coverage
```

| Test File | Coverage |
|-----------|----------|
| `tests/unit/cache.test.ts` | Store, expiry, invalidation, stats |
| `tests/unit/providers.test.ts` | Parse, timeout, 500, cache dedup |
| `tests/unit/router.test.ts` | Fallback chain, all-fail throw |
| `tests/unit/country.test.ts` | Module invalidation on switch |
| `tests/e2e/historical.test.ts` | 60-month data, 24h cache |

## Deployment

### Pipeline

```
dev → preview → validate → production
```

| Stage | Command |
|-------|---------|
| Dev | `npm run dev` |
| Preview | `./scripts/deploy-preview.sh` |
| Validate | `./scripts/validate.sh` |
| Production | `./scripts/deploy-prod.sh` (requires "yes") |

### GitHub → Netlify Auto-Deploy

1. Push repo to GitHub
2. Netlify Dashboard → "Add new site" → "Import from Git"
3. Select repo, branch `main`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables in Netlify UI

### Manual Deploy

```bash
npm run build
npx netlify deploy --dir=dist --prod
```

## Mobile App Conversion

This PWA-ready site can be wrapped as a mobile app:

| Tool | Command | Output |
|------|---------|--------|
| Capacitor | `npm install @capacitor/core @capacitor/cli` | iOS/Android native |
| Tauri | `npm install @tauri-apps/cli` | Desktop + mobile |
| PWA | Already has `manifest.json` | Add to home screen |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Node 20+, `npm ci --legacy-peer-deps` |
| API timeout | Check keys in `.env` or Netlify dashboard |
| 500 on functions | `netlify functions:logs` |
| Lighthouse < 90 | `npm run build` then `npx lhci autorun` |
| Cache stale | Hit `/health` to check cache stats |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/setup.sh` | Full setup: deps, type-check, test, build |
| `scripts/deploy-preview.sh` | Netlify preview deploy |
| `scripts/deploy-prod.sh` | Production deploy with confirmation |
| `scripts/validate.sh` | Post-build validation |

## License

MIT
