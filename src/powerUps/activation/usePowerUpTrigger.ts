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

import { log } from "../../log";
import { useActivePowerUps } from "../activeList/ActivePowerUpsContext";
import { usePowerUpList } from "../list/PowerUpListContext";
import { usePowerUpQueue } from "../queue/PowerUpQueueContext";

export function usePowerUpTrigger() {
  const players = usePlayers();
  const { sendRaceControlMessageToConnection } = useRaceControlMessage();
  const { powerUps } = usePowerUpList();
  const powerUpQueue = usePowerUpQueue();
  const activePowerUps = useActivePowerUps();

  const { addPowerUpToQueue } = powerUpQueue;

  useOnPacket(PacketType.ISP_OBH, (packet: IS_OBH) => {
    const triggerObjects: ObjectIndex[] = [
      ObjectIndex.AXO_CONE_GREEN,
      ObjectIndex.AXO_CONE_RED,
      ObjectIndex.AXO_CONE_BLUE,
      ObjectIndex.AXO_CONE_YELLOW,
    ];

    const isLayoutObject = Boolean(packet.OBHFlags & ObjectHitFlags.OBH_LAYOUT);
    const isObjectOnSpot = Boolean(
      packet.OBHFlags & ObjectHitFlags.OBH_ON_SPOT,
    );
    const isTriggerObject = triggerObjects.includes(packet.Index);

    if (!isLayoutObject || !isTriggerObject || !isObjectOnSpot) {
      log(
        `Not a valid power-up object hit: ${JSON.stringify({
          isLayoutObject,
          isTriggerObject,
          isObjectOnSpot,
        })}`,
      );
      return;
    }

    const targetPlayer = players.get(packet.PLID);

    if (!targetPlayer) {
      log(`Error: No player found for PLID ${packet.PLID}`);
      return;
    }

    log(`Power-up object hit by ${targetPlayer.PName} (PLID ${packet.PLID})`);

    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

    sendRaceControlMessageToConnection(
      targetPlayer.UCID,
      randomPowerUp.name,
      4_000,
    );

    if (!randomPowerUp.isInstant) {
      log(`Power-up ${randomPowerUp.id} is not instant, adding to queue`);
      addPowerUpToQueue(targetPlayer.PLID, randomPowerUp);
      return;
    }

    log(
      `Executing instant power-up for player ${targetPlayer.PLID}: ${randomPowerUp.id}`,
    );

    randomPowerUp.execute({
      player: targetPlayer,
      objectHitPacket: packet,
    });

    if (!randomPowerUp.timeout) {
      return;
    }

    activePowerUps.addPowerUp(
      targetPlayer.PLID,
      {
        ...randomPowerUp,
        timeout: randomPowerUp.timeout,
      },
      () => {
        randomPowerUp.cleanup?.({
          objectHitPacket: packet,
          player: targetPlayer,
        });
      },
    );
  });
}
