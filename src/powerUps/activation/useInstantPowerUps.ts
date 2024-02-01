import type { InSim } from "node-insim";
import {
  type IS_OBH,
  ObjectHitFlags,
  ObjectIndex,
  PacketType,
} from "node-insim/packets";
import {
  useConnections,
  useOnPacket,
  usePlayers,
  useRaceControlMessage,
} from "react-node-insim";

import { useLayout } from "../../layout/useLayout";
import { log } from "../../log";
import { usePowerUpList } from "../list/PowerUpListContext";
import { usePowerUpQueue } from "../queue/PowerUpQueueContext";

export function useInstantPowerUps() {
  const connections = useConnections();
  const players = usePlayers();
  const { sendRaceControlMessageToConnection } = useRaceControlMessage();
  const layout = useLayout();
  const { powerUps } = usePowerUpList();
  const powerUpQueue = usePowerUpQueue();

  const { addPowerUp } = powerUpQueue;

  useOnPacket(PacketType.ISP_OBH, (packet: IS_OBH, inSim: InSim) => {
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

    const powerUpValues = Object.values(powerUps);
    const randomPowerUpIndex = Math.floor(Math.random() * powerUpValues.length);
    const randomPowerUp = powerUpValues[randomPowerUpIndex];

    sendRaceControlMessageToConnection(
      targetPlayer.UCID,
      randomPowerUp.name,
      4_000,
    );

    if (!randomPowerUp.isInstant) {
      log(`Power-up ${randomPowerUp.id} is not instant, adding to queue`);
      addPowerUp(targetPlayer.PLID, randomPowerUp);
      return;
    }

    log(
      `Executing instant power-up for player ${targetPlayer.PLID}: ${randomPowerUp.id}`,
    );
    randomPowerUp.execute({
      objectHitPacket: packet,
      inSim,
      player: targetPlayer,
      connections,
      players,
      layout,
      powerUps,
      powerUpQueue,
      timeout: randomPowerUp.timeout,
    });
  });
}
