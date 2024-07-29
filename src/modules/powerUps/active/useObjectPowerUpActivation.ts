import {
  type IS_OBH,
  ObjectHitFlags,
  ObjectIndex,
  PacketType,
} from "node-insim/packets";
import {
  useOnPacket,
  usePlayers,
  useRaceControlMessage,
} from "react-node-insim";

import { useConnectionContext } from "@/contexts/ConnectionContext";

import { usePowerUpList } from "../list/usePowerUpList";
import { usePowerUpQueue } from "../queue/PowerUpQueueContext";
import { useActivePowerUps } from "./ActivePowerUpsContext";

export function useObjectPowerUpActivation() {
  const { connection, log } = useConnectionContext();
  const players = usePlayers();
  const { sendRaceControlMessageToConnection } = useRaceControlMessage();
  const { powerUps } = usePowerUpList();
  const { addPowerUpToQueue } = usePowerUpQueue();
  const activePowerUps = useActivePowerUps();

  useOnPacket(PacketType.ISP_OBH, (packet: IS_OBH) => {
    const player = players.get(packet.PLID);

    if (!player) {
      log(`Error: No player found for PLID ${packet.PLID}`);
      return;
    }
    if (player.UCID !== connection.UCID) {
      return;
    }

    const triggerObjects: ObjectIndex[] = [
      ObjectIndex.AXO_CONE_GREEN,
      ObjectIndex.AXO_CONE_RED,
      ObjectIndex.AXO_CONE_BLUE,
      ObjectIndex.AXO_CONE_YELLOW,
      ObjectIndex.AXO_POST_RED,
    ];

    const isLayoutObject = Boolean(packet.OBHFlags & ObjectHitFlags.OBH_LAYOUT);
    const isObjectOnSpot = Boolean(
      packet.OBHFlags & ObjectHitFlags.OBH_ON_SPOT,
    );
    const isTriggerObject = triggerObjects.includes(packet.Index);

    if (!isTriggerObject || !isObjectOnSpot) {
      log(
        `Not a valid power-up object hit: ${JSON.stringify({
          isLayoutObject,
          isTriggerObject,
          isObjectOnSpot,
        })}`,
      );
      return;
    }

    log(`Power-up object hit by ${player.PName} (PLID ${packet.PLID})`);

    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

    sendRaceControlMessageToConnection(player.UCID, randomPowerUp.name, 4_000);

    if (!randomPowerUp.isInstant) {
      addPowerUpToQueue(randomPowerUp);
      return;
    }

    randomPowerUp.execute({
      player,
      objectHitPacket: packet,
      activePowerUps: {
        current: activePowerUps.activePowerUps,
      },
    });

    if (!randomPowerUp.timeout) {
      return;
    }

    activePowerUps.addPowerUp(
      randomPowerUp,
      randomPowerUp.timeout,
      ({ activePowerUpsRef }) => {
        randomPowerUp.cleanup?.({
          objectHitPacket: packet,
          player,
          activePowerUps: activePowerUpsRef,
        });
      },
    );
  });
}
