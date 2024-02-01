import type { PowerUp, PowerUpId } from "../../types";
import { hayBale } from "./hayBale";
import { powerRestrictor } from "./powerRestrictor";
import { reset } from "./reset";

const powerUpDefinitions: Record<PowerUpId, Omit<PowerUp, "id">> = {
  hayBale,
  reset,
  powerRestrictor,
};

export const powerUps = Object.entries(powerUpDefinitions).map<PowerUp>(
  ([id, data]) =>
    ({
      id,
      ...data,
    }) as PowerUp,
);
