import { useContext } from "react";

import { PowerUpsContext } from "../context";

export function usePowerUpsContext() {
  const powerUpsContext = useContext(PowerUpsContext);

  if (powerUpsContext === null) {
    throw new Error(
      "usePowerUps hook must be called within <PowerUpsContext.Provider>",
    );
  }

  return powerUpsContext;
}
