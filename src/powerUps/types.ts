import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import type { Player, useConnections, usePlayers } from "react-node-insim";

import type { useLayout } from "../layout/useLayout";
import type { useMultiCarInfoRef } from "../multiCarInfo/useMultiCarInfoRef";
import type { PowerUpQueueContextType } from "./queue/PowerUpQueueContext";

export type PowerUpId = string;

type BasePowerUpExecutorContext = {
  inSim: InSim;
  player: Player;
  connections: ReturnType<typeof useConnections>;
  players: ReturnType<typeof usePlayers>;
  layout: ReturnType<typeof useLayout>;
  powerUps: PowerUp[];
  powerUpQueue: PowerUpQueueContextType;
  timeout?: number;
};

export type ManualPowerUpExecutorContext = BasePowerUpExecutorContext & {
  multiCarInfoRef: ReturnType<typeof useMultiCarInfoRef>;
};

export type InstantPowerUpExecutorContext = BasePowerUpExecutorContext & {
  objectHitPacket: IS_OBH;
};

type PowerUpBaseProps = {
  id: PowerUpId;
  name: string;
  timeout?: number;
};

export type InstantPowerUp = PowerUpBaseProps & {
  isInstant: true;
  execute: (context: InstantPowerUpExecutorContext) => void;
};

export type ManualPowerUp = PowerUpBaseProps & {
  isInstant?: false;
  execute: (context: ManualPowerUpExecutorContext) => void;
};

export type PowerUp = InstantPowerUp | ManualPowerUp;

export type PowerUpDefinition = Omit<PowerUp, "id">;
