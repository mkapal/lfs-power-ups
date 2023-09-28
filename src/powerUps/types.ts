import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import type { useConnections } from "react-node-insim";

export type PowerUp = {
  name: string;
  execute: (
    packet: IS_OBH,
    inSim: InSim,
    connections: ReturnType<typeof useConnections>,
  ) => void;
};
