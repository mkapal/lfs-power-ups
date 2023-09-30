import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import { ObjectHitFlags, ObjectIndex, PacketType } from "node-insim/packets";
import {
  useConnections,
  useOnPacket,
  usePlayers,
  useRaceControlMessage,
} from "react-node-insim";

import { log } from "../log";
import type { PowerUp } from "./types";

export function usePowerUps(powerUps: PowerUp[]) {
  const connections = useConnections();
  const players = usePlayers();
  const { sendRaceControlMessage } = useRaceControlMessage();

  useOnPacket(PacketType.ISP_OBH, onObjectHit(powerUps));

  function onObjectHit(powerUps: PowerUp[]) {
    return (packet: IS_OBH, inSim: InSim) => {
      log("Object hit");

      const RACE_CONTROL_MESSAGE_DURATION_MS = 4_000;

      const triggerObjects: ObjectIndex[] = [
        ObjectIndex.AXO_CONE_GREEN,
        ObjectIndex.AXO_CONE_RED,
        ObjectIndex.AXO_CONE_BLUE,
        ObjectIndex.AXO_CONE_YELLOW,
      ];

      const isLayoutObject = Boolean(
        packet.OBHFlags & ObjectHitFlags.OBH_LAYOUT,
      );
      const isObjectOnSpot = Boolean(
        packet.OBHFlags & ObjectHitFlags.OBH_ON_SPOT,
      );
      const isTriggerObject = triggerObjects.includes(packet.Index);

      if (!isLayoutObject || !isTriggerObject || !isObjectOnSpot) {
        return;
      }

      const randomPowerUpId = Math.floor(Math.random() * powerUps.length);
      const randomPowerUp = powerUps[randomPowerUpId];
      randomPowerUp.execute(packet, inSim, connections);

      const targetPlayer = players.get(packet.PLID);

      if (!targetPlayer) {
        log(`Error: No player found for PLID ${packet.PLID}`);
        return;
      }

      const targetConnection = connections.get(targetPlayer.UCID);

      if (!targetConnection) {
        log(`Error: No connection found for PLID ${packet.PLID}`);
        return;
      }

      sendRaceControlMessage(
        targetConnection,
        randomPowerUp.name,
        RACE_CONTROL_MESSAGE_DURATION_MS,
      );
    };
  }
}
