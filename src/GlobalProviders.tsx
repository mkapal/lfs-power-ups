import type { ReactNode } from "react";

import { PowerUpListProvider } from "@/modules/powerUps/list/context/PowerUpListProvider";

export type ProvidersProps = {
  children: ReactNode;
};

export function GlobalProviders({ children }: ProvidersProps) {
  return <PowerUpListProvider>{children}</PowerUpListProvider>;
}
