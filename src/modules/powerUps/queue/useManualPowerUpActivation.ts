import { PacketType } from "node-insim/packets";
import { useOnPacket, usePlayers } from "react-node-insim";

import { useConnectionContext } from "@/contexts/ConnectionContext";
import { log } from "@/log";

import { usePowerUpQueue } from "./PowerUpQueueContext";

export function useManualPowerUpActivation() {
  const players = usePlayers();
  const { powerUpQueue, removePowerUpFromQueue } = usePowerUpQueue();
  const { connection } = useConnectionContext();

  useOnPacket(PacketType.ISP_III, (packet) => {
    if (packet.Msg !== "powerup") {
      return;
    }

    log(
      `Player ${packet.PLID} (UCID ${connection.UCID}) requested activating a power-up`,
    );

    const [firstPowerUp] = powerUpQueue;
    const player = players.get(packet.PLID);

    if (!player) {
      log(
        `Player ${packet.PLID} (UCID ${connection.UCID}) failed to activate a power-up - player not found`,
      );
      return;
    }

    if (!firstPowerUp) {
      log(
        `Player ${packet.PLID} (UCID ${connection.UCID}) failed to activate a power-up - no power-ups in queue`,
      );
      return;
    }

    log(
      `Player ${packet.PLID} (UCID ${connection.UCID}) activated a power-up: ${firstPowerUp.queueId}`,
    );

    firstPowerUp.execute({
      player,
    });

    removePowerUpFromQueue(firstPowerUp);
  });
}
