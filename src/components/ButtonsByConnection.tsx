import type { ReactNode } from "react";
import { useConnections } from "react-node-insim";

import { ConnectionContextProvider } from "@/contexts/ConnectionContext";

export type ButtonsByConnectionProps = {
  children: ReactNode;
};

export function ButtonsByConnection({ children }: ButtonsByConnectionProps) {
  const connections = useConnections();

  return connections.map((connection) => (
    <ConnectionContextProvider key={connection.UCID} connection={connection}>
      {children}
    </ConnectionContextProvider>
  ));
}
