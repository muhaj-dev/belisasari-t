import type { ReactNode } from "react";

/** Prevents static prerender of /portfolio (avoids styled-components/React scope error in recharts deps) */
export const dynamic = "force-dynamic";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
