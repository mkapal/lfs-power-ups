import { IS_PLH, PlayerHCap, PlayerHCapFlags } from "node-insim/packets";

import type {
  ManualPowerUpExecutorContext,
  PowerUpDefinition,
} from "../../types";

export const powerRestrictor: PowerUpDefinition = {
  name: "^0Low Power",
  timeout: 5_000,
  isInstant: true,
  execute: powerRestrictorExecutor,
};

function powerRestrictorExecutor({
  inSim,
  player,
  timeout,
}: ManualPowerUpExecutorContext) {
  inSim.send(
    new IS_PLH({
      NumP: 1,
      HCaps: [
        new PlayerHCap({
          PLID: player.PLID,
          Flags: PlayerHCapFlags.INTAKE_RESTRICTION | PlayerHCapFlags.SILENT,
          H_TRes: 50,
        }),
      ],
    }),
  );

  if (timeout) {
    setTimeout(() => {
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
    }, timeout);
  }
}
