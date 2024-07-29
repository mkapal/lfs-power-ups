import { IS_PLH, PlayerHCap, PlayerHCapFlags } from "node-insim/packets";
import { useInSim } from "react-node-insim";

import { log, logPlayer } from "@/utils/log";

import type { InstantPowerUpHook } from "../../types";

export const useLowPower: InstantPowerUpHook = () => {
  const inSim = useInSim();

  return {
    name: "^0Low Power",
    timeout: 30_000,
    isInstant: true,
    execute: ({ player }) => {
      log(`${logPlayer(player)} - low power execute`);
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
      );
    },
    cleanup: ({ player, activePowerUps }) => {
      log(`${logPlayer(player)} - low power cleanup`);

      const hasOtherActivePowerUps =
        activePowerUps.current &&
        activePowerUps.current.filter((powerUp) => powerUp.id === "lowPower")
          .length > 1;

      if (hasOtherActivePowerUps) {
        log(
          `${logPlayer(player)} already has an active low power power-up - do not cleanup`,
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
