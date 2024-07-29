import { IS_PLH, PlayerHCap, PlayerHCapFlags } from "node-insim/packets";
import { useInSim } from "react-node-insim";

import { log } from "@/utils/log";

import type { InstantPowerUpHook } from "../../types";

export const usePowerRestrictor: InstantPowerUpHook = () => {
  const inSim = useInSim();

  return {
    name: "^0Low Power",
    timeout: 20_000,
    isInstant: true,
    execute: ({ player }) =>
      inSim.send(
        new IS_PLH({
          NumP: 1,
          HCaps: [
            new PlayerHCap({
              PLID: player.PLID,
              Flags:
                PlayerHCapFlags.INTAKE_RESTRICTION | PlayerHCapFlags.SILENT,
              H_TRes: 50,
            }),
          ],
        }),
      ),
    cleanup: ({ player, powerUpQueue }) => {
      const hasOtherActiveRestrictors = powerUpQueue.some(
        (powerUp) => powerUp.id === "powerRestrictor",
      );

      if (hasOtherActiveRestrictors) {
        log(
          `Player ${player.PName}^8 already has an active power restrictor - do not cleanup`,
        );
        return;
      }

      inSim.send(
        new IS_PLH({
          NumP: 1,
          HCaps: [
            new PlayerHCap({
              PLID: player.PLID,
              Flags:
                PlayerHCapFlags.INTAKE_RESTRICTION | PlayerHCapFlags.SILENT,
              H_TRes: 0,
            }),
          ],
        }),
      );
    },
  };
};
