import { NextRequest, NextResponse } from "next/server";
import type { HeliusEnhancedTransaction } from "@/lib/helius";

export const dynamic = "force-dynamic";

const NFT_TYPES = new Set([
  "NFT_SALE", "NFT_BID", "NFT_LISTING", "NFT_MINT", "NFT_CANCEL_LISTING",
  "NFT_BID_CANCELLED", "NFT_AUCTION_CREATED", "NFT_AUCTION_CANCELLED", "NFT_AUCTION_UPDATED",
  "COMPRESSED_NFT_MINT", "COMPRESSED_NFT_TRANSFER", "COMPRESSED_NFT_BURN",
  "BURN_NFT", "TRANSFER",
]);

function getHeliusBaseAndKey(): { base: string; apiKey: string } | null {
  const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
  if (!rpcUrl?.trim()) return null;
  try {
    const u = new URL(rpcUrl);
    const apiKey = u.searchParams.get("api-key") || u.searchParams.get("api_key") || "";
    if (!apiKey) return null;
    return { base: u.origin, apiKey };
  } catch {
    return null;
  }
}

/** GET /api/helius/nft-transactions?address=...&limit=25 - Enhanced transactions (NFT-related). */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 25, 100);
  const nftOnly = req.nextUrl.searchParams.get("nftOnly") !== "false";

  if (!address?.trim()) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  const helius = getHeliusBaseAndKey();
  if (!helius) {
    return NextResponse.json(
      { error: "RPC_URL with api-key (e.g. Helius) required for enhanced transactions." },
      { status: 503 }
    );
  }

  try {
    const params = new URLSearchParams({ "api-key": helius.apiKey, limit: String(limit), "sort-order": "desc" });
    const url = `${helius.base}/v0/addresses/${encodeURIComponent(address.trim())}/transactions?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(25000),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: Array.isArray(data) ? "No data" : (data?.error || data?.message || res.statusText) },
        { status: res.status }
      );
    }

    const list: HeliusEnhancedTransaction[] = Array.isArray(data) ? data : [];
    const transactions = nftOnly
      ? list.filter((t) => t.type && NFT_TYPES.has(t.type))
      : list;

    return NextResponse.json({ transactions });
  } catch (e) {
    console.error("Helius NFT transactions error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
