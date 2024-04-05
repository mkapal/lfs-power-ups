import { PacketType } from "node-insim/packets";
import { useOnPacket, usePlayers } from "react-node-insim";

import { log } from "../../log";
import { usePowerUpQueue } from "../queue/PowerUpQueueContext";

export function useManualPowerUps() {
  const players = usePlayers();
  const { powerUpQueueByPlayer, removePowerUpFromQueue } = usePowerUpQueue();

  useOnPacket(PacketType.ISP_III, (packet) => {
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
      player,
    });

    removePowerUpFromQueue(packet.PLID, firstPowerUp);
  });
}
