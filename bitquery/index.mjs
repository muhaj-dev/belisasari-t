import { fetchTokensForPlatform } from "./scripts/jup-api.mjs";
import { pushMemecoinsFromJup } from "./scripts/supabase/memecoins-from-jup.mjs";
import { pushPricesFromJup } from "./scripts/supabase/prices-from-jup.mjs";

// Polyfill for Node.js compatibility
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
dotenv.config({ path: join(__dirname, ".env") });
dotenv.config({ path: join(__dirname, "../.env") });
dotenv.config({ path: join(__dirname, "../js-scraper/.env") });

async function main() {
  try {
    console.log("🚀 Starting Jupiter (Tokens V2) data collection...");

    // Single fetch: recent + toptrending + toporganicscore + toptraded
    console.log("\n📡 Fetching tokens from Jupiter Tokens V2...");
    const tokens = await fetchTokensForPlatform({
      recentLimit: 50,
      categoryLimit: 100,
    });
    console.log(`   Fetched ${tokens.length} unique tokens.`);

    // Step 1: Push tokens to Supabase
    console.log("\n📈 Step 1: Pushing tokens (memecoins)...");
    await pushMemecoinsFromJup(tokens);

    // Step 2: Push prices/stats to Supabase (same token list)
    console.log("\n💰 Step 2: Pushing prices and 24h stats...");
    await pushPricesFromJup(tokens);

    console.log("\n✅ All data collection completed successfully!");
  } catch (e) {
    console.error("❌ Error during data collection:", e);
    process.exit(1);
  }
}

main();
