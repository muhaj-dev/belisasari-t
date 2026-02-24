'use client';

import React, { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { EnvironmentStoreProvider } from '@/components/context';
import SolanaWalletProvider from './wallet-provider';
import { ThemeProvider } from './theme-provider';
import { PrivyClientProvider } from '@/components/provider/PrivyClientProvider';
import { AppAuthStubProvider } from '@/components/provider/PrivyAppAuthContext';
import Layout from '@/components/sections/layout';
import { Toaster } from '@/components/ui/toaster';

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
    <RootErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AppTree>{children}</AppTree>
      </ThemeProvider>
    </RootErrorBoundary>
  );
}
