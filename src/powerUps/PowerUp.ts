import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import type { Player, useConnections, usePlayers } from "react-node-insim";

import type { useLayout } from "../layout/useLayout";
import type { useMultiCarInfoRef } from "../multiCarInfo/useMultiCarInfoRef";
import type { PowerUpQueueContextType } from "./queue/PowerUpQueueContext";
import type { PowerUp } from "./types";

abstract class AbstractPowerUp {
  protected constructor(
    public readonly name: string,
    protected readonly inSim: InSim,
    protected readonly player: Player,
    protected readonly connections: ReturnType<typeof useConnections>,
    protected readonly players: ReturnType<typeof usePlayers>,
    protected readonly layout: ReturnType<typeof useLayout>,
    protected readonly powerUps: PowerUp[],
    protected readonly powerUpQueue: PowerUpQueueContextType,
    public readonly timeout: number | null = null,
  ) {}

  abstract execute(): void;
  abstract cleanup(): void;
}

export abstract class ManualPowerUp extends AbstractPowerUp {
  protected constructor(
    name: string,
    inSim: InSim,
    player: Player,
    connections: ReturnType<typeof useConnections>,
    players: ReturnType<typeof usePlayers>,
    layout: ReturnType<typeof useLayout>,
    powerUps: PowerUp[],
    powerUpQueue: PowerUpQueueContextType,
    timeout: number | null = null,
    protected readonly multiCarInfoRef: ReturnType<typeof useMultiCarInfoRef>,
  ) {
    super(
      name,
      inSim,
      player,
      connections,
      players,
      layout,
      powerUps,
      powerUpQueue,
      timeout,
    );
  }
}

export abstract class InstantPowerUp extends AbstractPowerUp {
  protected constructor(
    name: string,
    inSim: InSim,
    player: Player,
    connections: ReturnType<typeof useConnections>,
    players: ReturnType<typeof usePlayers>,
    layout: ReturnType<typeof useLayout>,
    powerUps: PowerUp[],
    powerUpQueue: PowerUpQueueContextType,
    timeout: number | null = null,
    protected readonly objectHitPacket: IS_OBH,
  ) {
    super(
      name,
      inSim,
      player,
      connections,
      players,
      layout,
      powerUps,
      powerUpQueue,
      timeout,
    );
  }
}
