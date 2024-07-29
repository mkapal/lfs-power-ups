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
import { log } from "@/log";

import { usePowerUpList } from "../list/usePowerUpList";
import { usePowerUpQueue } from "../queue/PowerUpQueueContext";
import { useActivePowerUps } from "./ActivePowerUpsContext";

export function useObjectPowerUpActivation() {
  const { connection } = useConnectionContext();
  const players = usePlayers();
  const { sendRaceControlMessageToConnection } = useRaceControlMessage();
  const { powerUps } = usePowerUpList();
  const powerUpQueue = usePowerUpQueue();
  const activePowerUps = useActivePowerUps();

  const { addPowerUpToQueue } = powerUpQueue;

  useOnPacket(PacketType.ISP_OBH, (packet: IS_OBH) => {
    log(
      `Connection context: UCID ${connection.UCID} - object hit: ${packet.Index}`,
    );

    const targetPlayer = players.get(packet.PLID);

    if (!targetPlayer) {
      log(`Error: No player found for PLID ${packet.PLID}`);
      return;
    }

    log(
      `Object hit by ${targetPlayer.PName} (PLID ${packet.PLID}, UCID ${targetPlayer.UCID})`,
    );

    if (targetPlayer.UCID !== connection.UCID) {
      log(`Ignore UCID: ${connection.UCID}`);
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

    log(`Power-up object hit by ${targetPlayer.PName} (PLID ${packet.PLID})`);

    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

    sendRaceControlMessageToConnection(
      targetPlayer.UCID,
      randomPowerUp.name,
      4_000,
    );

    if (!randomPowerUp.isInstant) {
      log(
        `PLID ${targetPlayer.PLID} (UCID ${targetPlayer.UCID}) - Power-up ${randomPowerUp.id} is not instant, adding to queue`,
      );
      addPowerUpToQueue(randomPowerUp);
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
