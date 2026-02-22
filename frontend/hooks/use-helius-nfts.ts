"use client";

import { useState, useCallback, useEffect } from "react";
import type { HeliusDASAsset, HeliusEnhancedTransaction } from "@/lib/helius";

interface NftsResponse {
  items: HeliusDASAsset[];
  total?: number;
  page?: number;
  limit?: number;
}

interface TxResponse {
  transactions: HeliusEnhancedTransaction[];
}

export function useHeliusNfts(walletAddress: string | null) {
  const [nfts, setNfts] = useState<HeliusDASAsset[]>([]);
  const [transactions, setTransactions] = useState<HeliusEnhancedTransaction[]>([]);
  const [total, setTotal] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!walletAddress?.trim()) {
      setNfts([]);
      setTransactions([]);
      setTotal(undefined);
      setError(null);
      return;
    }
    const addr = walletAddress.trim();
    setError(null);

    setLoading(true);
    try {
      const nftRes = await fetch(
        `/api/helius/nfts?address=${encodeURIComponent(addr)}&limit=100`
      );
      const nftData: NftsResponse | { error?: string } = await nftRes.json().catch(() => ({}));
      if (!nftRes.ok) {
        setError((nftData as { error?: string }).error || "Failed to load NFTs");
        setNfts([]);
      } else {
        setNfts((nftData as NftsResponse).items ?? []);
        setTotal((nftData as NftsResponse).total);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load NFTs");
      setNfts([]);
    } finally {
      setLoading(false);
    }

    setLoadingTx(true);
    try {
      const txRes = await fetch(
        `/api/helius/nft-transactions?address=${encodeURIComponent(addr)}&limit=30&nftOnly=true`
      );
      const txData: TxResponse | { error?: string } = await txRes.json().catch(() => ({}));
      if (txRes.ok && "transactions" in txData) {
        setTransactions((txData as TxResponse).transactions ?? []);
      } else {
        setTransactions([]);
      }
    } catch {
      setTransactions([]);
    } finally {
      setLoadingTx(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { nfts, transactions, total, loading, loadingTx, error, refetch };
}
