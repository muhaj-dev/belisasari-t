'use client';

import React, { useEffect, useState } from 'react';
import { EnvironmentStoreProvider } from '@/components/context';
import SolanaWalletProvider from './wallet-provider';
import { ThemeProvider } from './theme-provider';
import { PrivyClientProvider } from '@/components/provider/PrivyClientProvider';
import Layout from '@/components/sections/layout';
import { Toaster } from '@/components/ui/toaster';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading Belisasari...</p>
      </div>
    </div>
  );
}

export default function SSRSafeProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Delay Privy/portals until after DOM is committed (avoids HierarchyRequestError: Only one element on document)
  useEffect(() => {
    if (!isClient) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, [isClient]);

  if (!isClient || !ready) {
    return <LoadingFallback />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <PrivyClientProvider>
        <EnvironmentStoreProvider>
          <SolanaWalletProvider>
            <Layout>{children}</Layout>
            <Toaster />
          </SolanaWalletProvider>
        </EnvironmentStoreProvider>
      </PrivyClientProvider>
    </ThemeProvider>
  );
}
