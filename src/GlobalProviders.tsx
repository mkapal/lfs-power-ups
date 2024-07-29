import type { ReactNode } from "react";
import { ConnectionsProvider, PlayersProvider } from "react-node-insim";

import { PowerUpListProvider } from "@/modules/powerUps/list/PowerUpListProvider";

export type ProvidersProps = {
  children: ReactNode;
};

export function GlobalProviders({ children }: ProvidersProps) {
  return (
    <ConnectionsProvider>
      <PlayersProvider>
        <PowerUpListProvider>{children}</PowerUpListProvider>
      </PlayersProvider>
    </ConnectionsProvider>
  );
}
