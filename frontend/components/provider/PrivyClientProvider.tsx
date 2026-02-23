'use client';

import { PrivyProvider } from '@privy-io/react-auth';

/**
 * Privy provider without @privy-io/react-auth/solana to avoid build errors from
 * mismatched @solana/* deps (bytesEqual, toArrayBuffer, SOLANA_ERROR__* not exported).
 * Solana wallet connection still works via the existing wallet adapter (Phantom, etc.) in the layout.
 * To re-enable Privy Solana connectors when their deps are fixed: add
 *   import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
 *   externalWallets: { solana: { connectors: toSolanaWalletConnectors() } },
 */
export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: { walletChainType: 'solana-only' },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
