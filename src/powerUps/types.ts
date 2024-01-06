import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import type { Player, useConnections, usePlayers } from "react-node-insim";

import type { useLayout } from "../layout";
import type { useMultiCarInfoRef } from "../multiCarInfo/useMultiCarInfoRef";
import type { PowerUpsContextType } from "./context";

export type PowerUpId = string;

export type ManualPowerUpExecutor = (
  context: ManualPowerUpExecutorContext,
) => void;

export type InstantPowerUpExecutor = (
  context: InstantPowerUpExecutorContext,
) => void;

type BasePowerUpExecutorContext = {
  inSim: InSim;
  player: Player;
  connections: ReturnType<typeof useConnections>;
  players: ReturnType<typeof usePlayers>;
  layout: ReturnType<typeof useLayout>;
  powerUpsContext: PowerUpsContextType;
  timeout?: number;
};

type ManualPowerUpExecutorContext = BasePowerUpExecutorContext & {
  multiCarInfoRef: ReturnType<typeof useMultiCarInfoRef>;
};

type InstantPowerUpExecutorContext = BasePowerUpExecutorContext & {
  objectHitPacket: IS_OBH;
};

type PowerUpBaseProps = {
  id: PowerUpId;
  name: string;
  timeout?: number;
};

export type InstantPowerUp = PowerUpBaseProps & {
  isInstant: true;
  execute: InstantPowerUpExecutor;
};

export type ManualPowerUp = PowerUpBaseProps & {
  isInstant?: false;
  execute: ManualPowerUpExecutor;
};

export type PowerUp = InstantPowerUp | ManualPowerUp;
