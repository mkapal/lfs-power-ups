import { useContext } from "react";

import { PowerUpListContext } from "./PowerUpListProvider";

export function usePowerUpList() {
  const powerUpListContext = useContext(PowerUpListContext);

  if (powerUpListContext === null) {
    throw new Error(
      "usePowerUpsContext hook must be called within <PowerUpListProvider>",
    );
  }

  return powerUpListContext;
}
