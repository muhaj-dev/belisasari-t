import { NextRequest, NextResponse } from "next/server";
import type { HeliusDASAssetsResponse } from "@/lib/helius";

export const dynamic = "force-dynamic";

function getRpcUrl(): string | null {
  const url = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
  if (!url?.trim()) return null;
  return url.trim();
}

/** GET /api/helius/nfts?address=...&limit=100 - DAS getAssetsByOwner (NFTs only). */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 100, 100);
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;

  if (!address?.trim()) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  const rpcUrl = getRpcUrl();
  if (!rpcUrl) {
    return NextResponse.json(
      { error: "RPC_URL not configured. Use Helius RPC for DAS (getAssetsByOwner)." },
      { status: 503 }
    );
  }

  try {
    const body = {
      jsonrpc: "2.0",
      id: "nfts",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: address.trim(),
        page,
        limit,
        sortBy: { sortBy: "recent_action", sortDirection: "desc" },
        options: {
          showUnverifiedCollections: false,
          showCollectionMetadata: true,
          showFungible: false,
          showNativeBalance: false,
        },
      },
    };

    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    const data: HeliusDASAssetsResponse = await res.json().catch(() => ({}));

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message, code: data.error.code },
        { status: res.ok ? 200 : 500 }
      );
    }

    const items = data.result?.items ?? [];
    return NextResponse.json({
      items,
      total: data.result?.total,
      page: data.result?.page ?? page,
      limit: data.result?.limit ?? limit,
    });
  } catch (e) {
    console.error("Helius NFTs error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}
