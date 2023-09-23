import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";

import type { CommonDependencies } from "../application";

export type PowerUp = {
  name: string;
  execute: (
    log: CommonDependencies["log"],
  ) => (packet: IS_OBH, inSim: InSim) => void;
};
