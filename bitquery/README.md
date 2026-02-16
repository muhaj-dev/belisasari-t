# Token & price data (Jupiter Tokens API V2)

This service fetches token and price data from **Jupiter Tokens API V2** and pushes it to Supabase. It replaces the previous Bitquery-based pipeline.

## Endpoints used

- **Recent** – `GET /tokens/v2/recent` – recently listed tokens (first pool creation)
- **Categories** – `GET /tokens/v2/{category}/{interval}`:
  - `toptrending/1h`
  - `toporganicscore/5m`
  - `toptraded/24h`
- Optional: **Tag** – `GET /tokens/v2/tag?query=verified`
- Optional: **Search** – `GET /tokens/v2/search?query=...` (mint, symbol, or name)

Data is written to `tokens` and `prices` tables. Each run fetches once, then upserts tokens and price/stats rows.

## Environment variables

| Variable | Required | Description |
|---------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_SECRET` | Yes | Supabase anonymous key |
| `JUPITER_API_KEY` | Yes | Jupiter API key (get one at https://station.jup.ag) |

No Bitquery credentials are needed.

## Run

```bash
cd bitquery
yarn install
node index.mjs
```

Or from repo root:

```bash
yarn full-collection
# or
cd bitquery && node index.mjs
```

## Scripts

- `node index.mjs` – full run (fetch from Jupiter → push tokens → push prices)
- `node scripts/memecoins.mjs` – fetch tokens and push to `tokens` only
- `node scripts/prices.mjs` – fetch tokens and push to `prices` only (or pass pre-fetched tokens if integrated in one flow)

## Reference

- [Jupiter Tokens API V2](https://station.jup.ag/docs/apis/tokens-api-v2)
