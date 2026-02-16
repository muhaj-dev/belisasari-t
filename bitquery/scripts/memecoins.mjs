import * as fs from "fs/promises";
import path from "path";
import { fetchTokensForPlatform } from "./jup-api.mjs";
import { pushMemecoinsFromJup } from "./supabase/memecoins-from-jup.mjs";

// Polyfill for Node.js compatibility
import fetch from "node-fetch";
import { Headers } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;

// Load env from multiple locations
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
dotenv.config({ path: join(__dirname, "../.env") });
dotenv.config({ path: join(__dirname, "../../.env") });
dotenv.config({ path: join(__dirname, "../../js-scraper/.env") });

const resultsDir = path.join(process.cwd(), "results", "memecoins");
await fs.mkdir(resultsDir, { recursive: true });

/**
 * Fetch tokens from Jupiter (recent + toptrending + toporganicscore + toptraded) and push to Supabase.
 */
export async function fetchAndPushMemecoins() {
  console.log("Starting memecoins fetch (Jupiter Tokens V2)...");

  const opts = {
    recentLimit: 50,
    categoryLimit: 100,
  };

  const tokens = await fetchTokensForPlatform(opts);
  console.log(`Fetched ${tokens.length} unique tokens from Jupiter.`);

  const resultFilename = path.join(resultsDir, `next-memecoins-${Date.now()}.json`);
  await fs.writeFile(resultFilename, JSON.stringify(tokens, null, 2), "utf-8");
  console.log(`Results saved to: ${resultFilename}`);

  await pushMemecoinsFromJup(tokens);
  console.log("Data successfully pushed to Supabase!");
  return tokens;
}

async function main() {
  try {
    console.log("Starting Jupiter Memecoins Fetch...");
    const result = await fetchAndPushMemecoins();
    console.log("Fetch completed successfully! Tokens:", result.length);
  } catch (error) {
    console.error("Error in main:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
