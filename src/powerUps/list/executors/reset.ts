import { IS_JRR, JRRAction, ObjectInfo } from "node-insim/packets";
import { useInSim } from "react-node-insim";

import type { InstantPowerUpHook } from "../../types";

export const useReset: InstantPowerUpHook = () => {
  const inSim = useInSim();

  return {
    name: "^0Reset",
    isInstant: true,
    execute: ({ objectHitPacket }) => {
      if (!objectHitPacket) {
        return;
      }

      inSim.send(
        new IS_JRR({
          PLID: objectHitPacket.PLID,
          JRRAction: JRRAction.JRR_RESET,
          StartPos: new ObjectInfo({
            X: objectHitPacket.C.X,
            Y: objectHitPacket.C.Y,
            Zbyte: objectHitPacket.C.Zbyte,
            Heading: objectHitPacket.C.Heading,
            Index: 0,
            Flags: 0x80,
          }),
        }),
      );
    },
  };
};
