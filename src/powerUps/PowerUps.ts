import type { InSim } from "node-insim";
import type { IS_OBH } from "node-insim/packets";
import { ObjectHitFlags, ObjectIndex, PacketType } from "node-insim/packets";

import type { CommonDependencies } from "../application";
import type { MessageSystem } from "../messages";
import type { RaceTracking } from "../raceTracking";
import type { PowerUp } from "./types";

type PowerUpsDependencies = CommonDependencies & {
  raceTracking: RaceTracking;
  messages: MessageSystem;
};

export function powerUps(deps: PowerUpsDependencies, powerUpList: PowerUp[]) {
  const { inSim } = deps;

  const log = deps.log.extend("powerUps");

  const depsWithLogger = { ...deps, log };

  inSim.on(PacketType.ISP_OBH, onObjectHit(depsWithLogger, powerUpList));
}

const onObjectHit =
  (
    {
      log,
      messages: { sendMessageToConnection, sendRaceControlMessage },
      raceTracking: { getConnectionByPLID },
    }: PowerUpsDependencies,
    powerUpList: PowerUp[],
  ) =>
  (packet: IS_OBH, inSim: InSim) => {
    log("Object hit");

    const RACE_CONTROL_MESSAGE_DURATION_MS = 3000;

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
      return;
    }

    const randomPowerUpId = Math.floor(Math.random() * powerUpList.length);
    const randomPowerUp = powerUpList[randomPowerUpId];
    randomPowerUp.execute(log)(packet, inSim);

    const targetConnection = getConnectionByPLID(packet.PLID);
    const userName = targetConnection?.UName;

    if (!userName) {
      log(`Error: No connection found for PLID ${packet.PLID}`);
      return;
    }

    sendMessageToConnection(
      targetConnection?.UCID,
      `${userName} got a power-up!`,
    );

    sendRaceControlMessage(
      userName,
      randomPowerUp.name,
      RACE_CONTROL_MESSAGE_DURATION_MS,
    );
  };
