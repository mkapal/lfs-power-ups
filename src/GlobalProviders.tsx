import type { ReactNode } from "react";
import { ConnectionsPlayersProvider } from "react-node-insim";

import { PowerUpListProvider } from "@/modules/powerUps/list/PowerUpListProvider";

export type ProvidersProps = {
  children: ReactNode;
};

export function GlobalProviders({ children }: ProvidersProps) {
  return (
    <ConnectionsPlayersProvider>
      <PowerUpListProvider>{children}</PowerUpListProvider>
    </ConnectionsPlayersProvider>
  );
}
