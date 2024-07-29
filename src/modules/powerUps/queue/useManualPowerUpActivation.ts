import { PacketType } from "node-insim/packets";
import { useOnPacket, usePlayers } from "react-node-insim";

import { useConnectionContext } from "@/contexts/ConnectionContext";

import { useActivePowerUps } from "../active/ActivePowerUpsContext";
import { usePowerUpQueue } from "./PowerUpQueueContext";

export function useManualPowerUpActivation() {
  const players = usePlayers();
  const { powerUpQueue, removePowerUpFromQueue } = usePowerUpQueue();
  const { activePowerUps } = useActivePowerUps();
  const { connection, log } = useConnectionContext();

  useOnPacket(PacketType.ISP_III, (packet) => {
    if (packet.Msg !== "powerup") {
      return;
    }

    log(`Player ${packet.PLID} requested activating a power-up`);

    const player = players.get(packet.PLID);

    if (!player) {
      log(
        `Player ${packet.PLID} failed to activate a power-up - player not found`,
      );
      return;
    }

    if (player.UCID !== connection.UCID) {
      log(
        `Player ${packet.PLID} (UCID ${player.UCID}) skip activating a power-up - UCID does not match`,
      );
      return;
    }

    const [firstPowerUp] = powerUpQueue;

    if (!firstPowerUp) {
      log(
        `Player ${packet.PLID} failed to activate a power-up - no power-ups in queue`,
      );
      return;
    }

    log(`Player ${packet.PLID} activated a power-up: ${firstPowerUp.queueId}`);

    firstPowerUp.execute({
      player,
      activePowerUps: {
        current: activePowerUps,
      },
    });

    removePowerUpFromQueue(firstPowerUp);
  });
}
