import { createContext, type ReactNode } from "react";

import type { PowerUp } from "@/modules/powerUps/types";

import { useCarReset } from "./executors/useCarReset";
import { useHayBale } from "./executors/useHayBale";
import { usePowerRestrictor } from "./executors/usePowerRestrictor";

type PowerUpListContextType = {
  powerUps: PowerUp[];
};

export const PowerUpListContext = createContext<PowerUpListContextType | null>(
  null,
);

type PowerUpsProviderProps = {
  children: ReactNode;
};

export function PowerUpListProvider({ children }: PowerUpsProviderProps) {
  const powerRestrictor = usePowerRestrictor();
  const hayBale = useHayBale();
  const reset = useCarReset();

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
