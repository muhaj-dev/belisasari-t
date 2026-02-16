import * as fs from "fs/promises";
import path from "path";
import { fetchTokensForPlatform } from "./jup-api.mjs";
import { pushPricesFromJup } from "./supabase/prices-from-jup.mjs";

import fetch from "node-fetch";
import { Headers } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
dotenv.config({ path: join(__dirname, "../.env") });
dotenv.config({ path: join(__dirname, "../../.env") });
dotenv.config({ path: join(__dirname, "../../js-scraper/.env") });

const resultsDir = path.join(process.cwd(), "results", "prices");
await fs.mkdir(resultsDir, { recursive: true });

/**
 * Fetch tokens from Jupiter (same sources as memecoins), then push price/stats to Supabase.
 * Can accept pre-fetched tokens to avoid double API call when run after memecoins.
 * @param {Array} [preFetchedTokens] - Optional Jupiter token array from fetchTokensForPlatform()
 */
export async function fetchAndPushPrices(preFetchedTokens = null) {
  console.log("💰 Step: Fetching and pushing prices (Jupiter Tokens V2)...");

  const tokens = preFetchedTokens ?? (await fetchTokensForPlatform({ recentLimit: 50, categoryLimit: 100 }));
  console.log(`Using ${tokens.length} tokens for prices.`);

  const timestamp = new Date().toISOString();
  const resultPath = path.join(resultsDir, `prices-${Date.now()}.json`);
  await fs.writeFile(resultPath, JSON.stringify({ timestamp, count: tokens.length, data: tokens }, null, 2), "utf-8");
  console.log(`Prices snapshot saved to: ${resultPath}`);

  await pushPricesFromJup(tokens, timestamp);
  console.log("✅ Prices data successfully processed and stored!");
}

// Run when executed directly (e.g. node scripts/prices.mjs)
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAndPushPrices().catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });
}
