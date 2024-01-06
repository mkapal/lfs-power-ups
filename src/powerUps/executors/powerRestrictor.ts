import { IS_PLH, PlayerHCap, PlayerHCapFlags } from "node-insim/packets";

import type { ManualPowerUpExecutor } from "../types";

export const powerRestrictor: ManualPowerUpExecutor = ({
  inSim,
  player,
  timeout,
}) => {
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
};
