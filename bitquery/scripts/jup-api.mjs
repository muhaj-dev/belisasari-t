/**
 * Jupiter Tokens API V2 client
 * https://station.jup.ag/docs/apis/tokens-api-v2
 * - Search by mint/symbol/name
 * - Query by tag (verified, lst)
 * - Get category (toporganicscore, toptraded, toptrending) with interval 5m, 1h, 6h, 24h
 * - Get recent (first pool created)
 */

// Trailing slash required so relative paths (e.g. "toptrending/1h") resolve to .../v2/toptrending/1h
const JUP_BASE = "https://api.jup.ag/tokens/v2/";

function ensureApiKey() {
  const key = process.env.JUPITER_API_KEY;
  if (!key || typeof key !== "string" || !key.trim()) {
    throw new Error(
      "JUPITER_API_KEY is required. Set it in your .env (see .env.example). Get a key from https://station.jup.ag"
    );
  }
  return key.trim();
}

function getHeaders() {
  const key = ensureApiKey();
  return {
    "Content-Type": "application/json",
    "x-api-key": key,
  };
}

/**
 * Fetch from Jupiter Tokens V2 API
 * @param {string} path - e.g. "recent", "tag?query=verified", "toporganicscore/5m?limit=100"
 * @param {{ limit?: number }} [opts]
 * @returns {Promise<Array>} Array of mint objects
 */
export async function fetchJup(path, opts = {}) {
  const url = new URL(path, JUP_BASE);
  if (opts.limit != null) url.searchParams.set("limit", String(opts.limit));
  const res = await fetch(url.toString(), { headers: getHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jupiter API ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Search by mint, symbol, or name. Comma-separate for multiple (max 100 mints).
 * @param {string} query - mint address(es), symbol(s), or name(s)
 * @param {{ limit?: number }} [opts]
 */
export async function search(query, opts = {}) {
  const path = `search?query=${encodeURIComponent(query)}`;
  return fetchJup(path, { limit: opts.limit ?? 20, ...opts });
}

/**
 * Get tokens by tag: "verified" or "lst"
 */
export async function getByTag(tag = "verified") {
  return fetchJup(`tag?query=${encodeURIComponent(tag)}`);
}

/**
 * Get category with interval. Category: toporganicscore | toptraded | toptrending. Interval: 5m | 1h | 6h | 24h.
 * @param {string} category
 * @param {string} interval
 * @param {{ limit?: number }} [opts]
 */
export async function getCategory(category, interval, opts = {}) {
  const path = `${category}/${interval}`;
  return fetchJup(path, { limit: opts.limit ?? 50, ...opts });
}

/**
 * Recently listed tokens (first pool creation time). Default 30 mints.
 */
export async function getRecent(opts = {}) {
  return fetchJup("recent", { limit: opts.limit ?? 30, ...opts });
}

/**
 * Fetch tokens for memecoin dashboard: recent + trending + top organic + top traded.
 * Deduplicates by mint id.
 * @param {{ recentLimit?: number, categoryLimit?: number }} [opts]
 * @returns {Promise<Array>} Unique tokens with full mint info
 */
export async function fetchTokensForPlatform(opts = {}) {
  const recentLimit = opts.recentLimit ?? 50;
  const categoryLimit = opts.categoryLimit ?? 100;

  const [recent, toptrending1h, toporganicscore5m, toptraded24h] = await Promise.all([
    getRecent({ limit: recentLimit }),
    getCategory("toptrending", "1h", { limit: categoryLimit }),
    getCategory("toporganicscore", "5m", { limit: categoryLimit }),
    getCategory("toptraded", "24h", { limit: categoryLimit }),
  ]);

  const byId = new Map();
  for (const t of [recent, toptrending1h, toporganicscore5m, toptraded24h].flat()) {
    if (t && t.id) byId.set(t.id, t);
  }
  return Array.from(byId.values());
}
