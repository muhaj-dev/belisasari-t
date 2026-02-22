import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function NftsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
