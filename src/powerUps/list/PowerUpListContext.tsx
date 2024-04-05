import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { PowerUp } from "../types";
import { useHayBale } from "./executors/hayBale";
import { usePowerRestrictor } from "./executors/powerRestrictor";
import { useReset } from "./executors/reset";

type PowerUpListContextType = {
  powerUps: PowerUp[];
};

const PowerUpListContext = createContext<PowerUpListContextType | null>(null);

type PowerUpsProviderProps = {
  children: ReactNode;
};

export function PowerUpListProvider({ children }: PowerUpsProviderProps) {
  const powerRestrictor = usePowerRestrictor();
  const hayBale = useHayBale();
  const reset = useReset();

  const powerUpMap = {
    powerRestrictor,
    hayBale,
    reset,
  };

  const powerUps = Object.entries(powerUpMap).map(
    ([id, powerUp]) =>
      ({
        id,
        ...powerUp,
      }) as PowerUp,
  );

  return (
    <PowerUpListContext.Provider value={{ powerUps }}>
      {children}
    </PowerUpListContext.Provider>
  );
}

export function usePowerUpList() {
  const powerUpListContext = useContext(PowerUpListContext);

  if (powerUpListContext === null) {
    throw new Error(
      "usePowerUpsContext hook must be called within <PowerUpListProvider>",
    );
  }

  return powerUpListContext;
}
