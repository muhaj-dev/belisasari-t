import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Polyfill for Node.js compatibility
import fetch from "node-fetch";
import { Headers } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
dotenv.config({ path: join(__dirname, "../../.env") });
dotenv.config({ path: join(__dirname, "../../../.env") });
dotenv.config({ path: join(__dirname, "../../../js-scraper/.env") });

const sanitize = (str) => (str != null && typeof str === "string" ? str.replace(/\u0000/g, "") : str);

/**
 * Map Jupiter token object to Supabase tokens table row.
 * @param {Object} jupToken - Jupiter Tokens V2 mint object
 */
function jupToTokenRow(jupToken) {
  const uri = sanitize(jupToken.id); // mint address as canonical uri
  if (!uri) return null;
  return {
    uri,
    name: sanitize(jupToken.name) ?? null,
    symbol: sanitize(jupToken.symbol) ?? null,
    description: null,
    image_url: sanitize(jupToken.icon) ?? null,
    address: sanitize(jupToken.id) ?? null,
    create_tx: null, // Jupiter does not provide
    market_cap: jupToken.mcap != null ? Number(jupToken.mcap) : null,
    total_supply: jupToken.totalSupply != null ? Number(jupToken.totalSupply) : null,
    decimals: jupToken.decimals ?? 9,
    created_at: jupToken.firstPool?.createdAt ?? jupToken.updatedAt ?? new Date().toISOString(),
    updated_at: jupToken.updatedAt ?? new Date().toISOString(),
    last_updated: jupToken.updatedAt ?? new Date().toISOString(),
    views: 0,
    mentions: 0,
    metadata: {
      tags: jupToken.tags ?? [],
      organicScore: jupToken.organicScore,
      organicScoreLabel: jupToken.organicScoreLabel,
      isVerified: jupToken.isVerified,
      holderCount: jupToken.holderCount,
      liquidity: jupToken.liquidity,
      fdv: jupToken.fdv,
      cexes: jupToken.cexes,
      ...(jupToken.audit && { audit: jupToken.audit }),
    },
  };
}

/**
 * Push Jupiter token list to Supabase tokens table (upsert by uri).
 * @param {Array} jupTokens - Array of Jupiter Tokens V2 mint objects
 */
export async function pushMemecoinsFromJup(jupTokens) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_SECRET;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_SECRET");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const rows = [];
  for (const t of jupTokens) {
    const row = jupToTokenRow(t);
    if (row) rows.push(row);
  }

  if (rows.length === 0) {
    console.log("No token rows to push.");
    return;
  }

  const uniqueByUri = [...new Map(rows.map((r) => [r.uri, r])).values()];
  const batchSize = 300;
  for (let i = 0; i < uniqueByUri.length; i += batchSize) {
    const batch = uniqueByUri.slice(i, i + batchSize);
    const { error } = await supabase.from("tokens").upsert(batch, { onConflict: "uri" });
    if (error) {
      console.error(`Failed to upsert tokens batch at ${i}:`, error);
      throw error;
    }
    console.log(`Upserted tokens batch ${i}–${i + batch.length}`);
  }
  console.log(`Push complete: ${uniqueByUri.length} tokens.`);
}
