import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { PowerUp } from "../types";
import { powerUps } from "./executors";

type PowerUpListContextType = {
  powerUps: PowerUp[];
};

const PowerUpListContext = createContext<PowerUpListContextType | null>(null);

type PowerUpsProviderProps = {
  children: ReactNode;
};

export function PowerUpListProvider({ children }: PowerUpsProviderProps) {
  return (
    <PowerUpListContext.Provider value={{ powerUps }}>
      {children}
    </PowerUpListContext.Provider>
  );
}

export function usePowerUpList() {
  const powerUpsContext = useContext(PowerUpListContext);

  if (powerUpsContext === null) {
    throw new Error(
      "usePowerUpsContext hook must be called within <PowerUpsContext.Provider>",
    );
  }

  return powerUpsContext;
}
