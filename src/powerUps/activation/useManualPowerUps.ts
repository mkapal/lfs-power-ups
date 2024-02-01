import { PacketType } from "node-insim/packets";
import { useConnections, useOnPacket, usePlayers } from "react-node-insim";

import { useLayout } from "../../layout/useLayout";
import { log } from "../../log";
import { useMultiCarInfoRef } from "../../multiCarInfo/useMultiCarInfoRef";
import { usePowerUpList } from "../list/PowerUpListContext";
import { usePowerUpQueue } from "../queue/PowerUpQueueContext";

export function useManualPowerUps() {
  const connections = useConnections();
  const players = usePlayers();
  const multiCarInfoRef = useMultiCarInfoRef();
  const layout = useLayout();
  const { powerUps } = usePowerUpList();
  const powerUpQueue = usePowerUpQueue();

  const { powerUpQueueByPlayer, removePowerUp } = powerUpQueue;

  useOnPacket(PacketType.ISP_III, (packet, inSim) => {
    if (packet.Msg !== "powerup") {
      return;
    }

    log(`Player ${packet.PLID} requested activating a power-up`);

    const [firstPowerUp] = powerUpQueueByPlayer[packet.PLID] ?? [];
    const player = players.get(packet.PLID);

    if (!player) {
      log(
        `Player ${packet.PLID} failed to activate a power-up - player not found`,
      );
      return;
    }

    if (!firstPowerUp) {
      log(
        `Player ${packet.PLID} failed to activate a power-up - no power-ups in queue`,
      );
      return;
    }

    log(`Player ${packet.PLID} activated a power-up: ${firstPowerUp.queueId}`);

    firstPowerUp.execute({
      multiCarInfoRef,
      inSim,
      player,
      connections,
      players,
      layout,
      powerUps,
      powerUpQueue,
      timeout: firstPowerUp.timeout,
    });

    removePowerUp(packet.PLID, firstPowerUp);
  });
}
