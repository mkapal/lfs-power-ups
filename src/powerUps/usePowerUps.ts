import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import { ObjectHitFlags, ObjectIndex, PacketType } from "node-insim/packets";
import {
  useConnections,
  useOnPacket,
  usePlayers,
  useRaceControlMessage,
} from "react-node-insim";

import { useLayout } from "../layout";
import { log } from "../log";
import { useMultiCarInfoRef } from "../multiCarInfo/useMultiCarInfoRef";
import { usePowerUpsContext } from "./hooks";

export function usePowerUps() {
  const powerUpsContext = usePowerUpsContext();
  const connections = useConnections();
  const players = usePlayers();
  const { sendRaceControlMessageToConnection } = useRaceControlMessage();
  const layout = useLayout();
  const multiCarInfoRef = useMultiCarInfoRef();

  const { powerUps, powerUpQueueByPlayer } = powerUpsContext;

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
      powerUpsContext,
      timeout: firstPowerUp.timeout,
    });

    powerUpsContext.removePowerUp(packet.PLID, firstPowerUp);
  });

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
      log("Not a valid power-up object hit");
      console.log({ isLayoutObject, isTriggerObject, isObjectOnSpot });
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

    if (!randomPowerUp.isInstant) {
      log(`Power-up ${randomPowerUp.id} is not instant, adding to queue`);
      powerUpsContext.addPowerUp(targetPlayer.PLID, randomPowerUp);
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
      powerUpsContext,
      timeout: randomPowerUp.timeout,
    });

    sendRaceControlMessageToConnection(
      targetPlayer.UCID,
      randomPowerUp.name,
      4_000,
    );
  });
}
