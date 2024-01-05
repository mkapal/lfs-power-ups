import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import type { useConnections, usePlayers } from "react-node-insim";

import type { useLayout } from "../layout";

export type PowerUpExecutor = (context: PowerUpExecutorContext) => void;

export type PowerUp = {
  name: string;
  execute: PowerUpExecutor;
};

type PowerUpExecutorContext = {
  packet: IS_OBH;
  inSim: InSim;
  connections: ReturnType<typeof useConnections>;
  players: ReturnType<typeof usePlayers>;
  layout: ReturnType<typeof useLayout>;
};
