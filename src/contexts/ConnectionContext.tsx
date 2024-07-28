import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Connection } from "react-node-insim";

export type ConnectionContextType = {
  connection: Connection;
};

const ConnectionContext = createContext<ConnectionContextType | null>(null);

type ConnectionContextProviderProps = {
  children: ReactNode;
  connection: Connection;
};

export function ConnectionContextProvider({
  children,
  connection,
}: ConnectionContextProviderProps) {
  return (
    <ConnectionContext.Provider value={{ connection }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionContext() {
  const connectionContext = useContext(ConnectionContext);

  if (connectionContext === null) {
    throw new Error(
      "useConnectionContext hook must be called within <ConnectionContextProvider>",
    );
  }

  return connectionContext;
}
