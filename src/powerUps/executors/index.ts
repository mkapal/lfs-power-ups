import type { PowerUp, PowerUpId } from "../types";
import { hayBale } from "./hayBale";
import { powerRestrictor } from "./powerRestrictor";
import { reset } from "./reset";

const powerUpDefinitions: Record<PowerUpId, Omit<PowerUp, "id">> = {
  hayBale: {
    name: "^3Hay Bale",
    execute: hayBale,
    timeout: 5_000,
  },
  reset: {
    name: "^1Instant Reset",
    execute: reset,
    timeout: 4_000,
    isInstant: true,
  },
  noPower: {
    name: "^0Low Power",
    execute: powerRestrictor,
    timeout: 5_000,
    isInstant: true,
  },
};

export const powerUps = Object.entries(powerUpDefinitions).map<PowerUp>(
  ([id, data]) =>
    ({
      id,
      ...data,
    }) as PowerUp,
);
