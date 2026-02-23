'use client';

import React, { createContext, useContext } from 'react';

export type AppAuthValue = {
  ready: boolean;
  authenticated: boolean;
  user: { wallet?: { address: string }; username?: string } | null;
  /** Accepts e.g. { loginMethods: ['wallet'], walletChainType: 'solana-only' }; implementation may be Privy or stub. */
  login: (opts?: unknown) => void | Promise<void>;
  logout: () => void | Promise<void>;
};

const stubAuth: AppAuthValue = {
  ready: true,
  authenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
};

const AppAuthContext = createContext<AppAuthValue>(stubAuth);

export function AppAuthStubProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppAuthContext.Provider value={stubAuth}>
      {children}
    </AppAuthContext.Provider>
  );
}

export function AppAuthContextProvider({
  value,
  children,
}: {
  value: AppAuthValue;
  children: React.ReactNode;
}) {
  return (
    <AppAuthContext.Provider value={value}>
      {children}
    </AppAuthContext.Provider>
  );
}

export function useAppAuth() {
  return useContext(AppAuthContext);
}
