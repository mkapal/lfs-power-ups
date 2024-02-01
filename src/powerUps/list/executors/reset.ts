import { IS_JRR, JRRAction, ObjectInfo } from "node-insim/packets";

import type {
  InstantPowerUpExecutorContext,
  PowerUpDefinition,
} from "../../types";

export const reset: PowerUpDefinition = {
  name: "^0Reset",
  timeout: 4_000,
  isInstant: true,
  execute: resetExecutor,
};

function resetExecutor({
  objectHitPacket,
  inSim,
}: InstantPowerUpExecutorContext) {
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
}
