import { IS_JRR, JRRAction, ObjectInfo } from "node-insim/packets";

import type { PowerUp } from "../types";

export const reset: PowerUp = {
  name: "^3Instant Reset!",
  execute: (packet, inSim) => {
    inSim.send(
      new IS_JRR({
        PLID: packet.PLID,
        JRRAction: JRRAction.JRR_RESET,
        StartPos: new ObjectInfo({
          X: packet.C.X,
          Y: packet.C.Y,
          Zbyte: packet.C.Zbyte,
          Heading: packet.C.Heading,
          Index: 0,
          Flags: 0x80,
        }),
      }),
    );
  },
};
