import { createContext, type ReactNode } from "react";

import type { PowerUp } from "@/modules/powerUps/types";

import { useCarReset } from "./executors/useCarReset";
import { useHayBale } from "./executors/useHayBale";
import { useLowPower } from "./executors/useLowPower";

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
  const lowPower = useLowPower();
  const hayBale = useHayBale();
  const reset = useCarReset();

  const powerUpMap = {
    lowPower,
    // hayBale,
    // reset,
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
