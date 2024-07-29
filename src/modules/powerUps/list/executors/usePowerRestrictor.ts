import { IS_PLH, PlayerHCap, PlayerHCapFlags } from "node-insim/packets";
import { useInSim } from "react-node-insim";

import { log, logPlayer } from "@/utils/log";

import type { InstantPowerUpHook } from "../../types";

export const usePowerRestrictor: InstantPowerUpHook = () => {
  const inSim = useInSim();

  return {
    name: "^0Low Power",
    timeout: 10_000,
    isInstant: true,
    execute: ({ player }) => {
      log(`${logPlayer(player)} - power restrictor execute`);
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
      log(`${logPlayer(player)} - power restrictor cleanup`);
      log(
        `Active power-ups: ${JSON.stringify(activePowerUps.current?.map((p) => p.queueId))}`,
      );

      const hasOtherActiveRestrictors =
        activePowerUps.current &&
        activePowerUps.current.filter(
          (powerUp) => powerUp.id === "powerRestrictor",
        ).length > 1;

      if (hasOtherActiveRestrictors) {
        log(
          `${logPlayer(player)} already has an active power restrictor - do not cleanup`,
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
