/**
 * Helius DAS API and Enhanced Transactions types.
 * @see https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api
 * @see https://docs.helius.dev/solana-apis/enhanced-transactions-api
 */

/** DAS API asset item (NFT or token) from getAssetsByOwner */
export interface HeliusDASAsset {
  interface?: string;
  id: string;
  content?: {
    $schema?: string;
    json_uri?: string;
    files?: Array<{ uri?: string; cdn_uri?: string; mime?: string }>;
    metadata?: Record<string, unknown>;
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
  ownership?: {
    owner: string;
    frozen?: boolean;
    delegated?: boolean;
    delegate?: string;
    ownership_model?: string;
  };
  royalty?: {
    royalty_model?: string;
    percent?: number;
    basis_points?: number;
    primary_sale_happened?: boolean;
  };
  creators?: Array<{ address: string; verified?: boolean; share?: number }>;
  compression?: {
    eligible: boolean;
    compressed?: boolean;
    data_hash?: string;
    creator_hash?: string;
    asset_hash?: string;
  };
  supply?: { print_max_supply?: number; print_current_supply?: number };
  mutable?: boolean;
  burnt?: boolean;
  [key: string]: unknown;
}

export interface HeliusDASAssetsResponse {
  jsonrpc: string;
  id?: string;
  result?: {
    items: HeliusDASAsset[];
    total?: number;
    limit?: number;
    page?: number;
    last_indexed_slot?: number;
  };
  error?: { code: number; message: string };
}

/** Enhanced transaction from Helius /v0/addresses/{address}/transactions */
export interface HeliusEnhancedTransaction {
  signature: string;
  type?: string;
  source?: string;
  description?: string;
  fee?: number;
  feePayer?: string;
  slot?: number;
  timestamp?: number;
  nativeTransfers?: Array<{ fromUserAccount: string; toUserAccount: string; amount: number }>;
  tokenTransfers?: Array<{
    fromUserAccount?: string;
    toUserAccount?: string;
    fromTokenAccount?: string;
    toTokenAccount?: string;
    tokenAmount?: number;
    mint?: string;
    tokenStandard?: string;
  }>;
  accountData?: unknown[];
  instructions?: Array<{ programId: string; innerInstructions?: unknown[] }>;
  events?: {
    nft?: { mint?: string; name?: string; collection?: string; [key: string]: unknown };
    swap?: unknown;
    compressed?: unknown;
  };
  [key: string]: unknown;
}
