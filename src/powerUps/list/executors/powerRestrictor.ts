import { IS_PLH, PlayerHCap, PlayerHCapFlags } from "node-insim/packets";
import { useInSim } from "react-node-insim";

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
    cleanup: ({ player }) => {
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