import type { IS_OBH } from "node-insim/packets";
import type { Player } from "react-node-insim";

import type { Queue } from "./queue/PowerUpQueueContext";

export type PowerUpId = string;

type BasePowerUpExecutorContext = {
  player: Player;
  powerUpQueue: Queue;
};

export type ManualPowerUpExecutorContext = BasePowerUpExecutorContext;

export type InstantPowerUpExecutorContext = BasePowerUpExecutorContext & {
  objectHitPacket: IS_OBH;
};

type PowerUpDefinitionBase<TContext extends BasePowerUpExecutorContext> = {
  name: string;
  timeout?: number;
  execute: (context: TContext) => void;
  cleanup?: (context: TContext) => void;
};

export type InstantPowerUpHook = () => InstantPowerUpDefinition;

export type ManualPowerUpHook = () => ManualPowerUpDefinition;

export type InstantPowerUpDefinition = {
  isInstant: true;
} & PowerUpDefinitionBase<InstantPowerUpExecutorContext>;

export type ManualPowerUpDefinition = {
  isInstant: false;
} & PowerUpDefinitionBase<ManualPowerUpExecutorContext>;

export type ManualPowerUp = ManualPowerUpDefinition & {
  id: PowerUpId;
};

export type InstantPowerUp = InstantPowerUpDefinition & {
  id: PowerUpId;
};

export type PowerUp = ManualPowerUp | InstantPowerUp;
