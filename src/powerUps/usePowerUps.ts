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
import { fakePowerUp, hayBale, reset } from "./powerUps";
import type { PowerUp } from "./types";

const powerUps: PowerUp[] = [
  {
    name: "^3Hay Bale!",
    execute: hayBale,
  },
  {
    name: "^3Reset!",
    execute: reset,
  },
  {
    name: "^3Fake PowerUp!",
    execute: fakePowerUp,
  },
];

export function usePowerUps() {
  const connections = useConnections();
  const players = usePlayers();
  const { sendRaceControlMessageToConnection } = useRaceControlMessage();
  const layout = useLayout();

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
      log("Not a valid object hit");
      console.log({ isLayoutObject, isTriggerObject, isObjectOnSpot });
      return;
    }

    const randomPowerUpId = Math.floor(Math.random() * powerUps.length);
    const randomPowerUp = powerUps[randomPowerUpId];
    randomPowerUp.execute({
      packet,
      inSim,
      connections,
      players,
      layout,
    });

    const targetPlayer = players.get(packet.PLID);

    if (!targetPlayer) {
      log(`Error: No player found for PLID ${packet.PLID}`);
      return;
    }

    log(`Object hit by ${targetPlayer.PName} (PLID ${packet.PLID})`);

    sendRaceControlMessageToConnection(
      targetPlayer.UCID,
      randomPowerUp.name,
      4_000,
    );
  });
}
