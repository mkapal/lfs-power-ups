import { InSim } from "node-insim";
import {
  IS_MTC,
  IS_OBH,
  ObjectHitFlags,
  ObjectIndex,
  PacketType,
} from "node-insim/packets";
import { log } from "../log";
import { App } from "../App";
import { PowerUp } from "./PowerUp";

export class PowerUps {
  private readonly app: App;
  private readonly powerUps: PowerUp[] = [];

  constructor(app: App, powerUps: PowerUp[]) {
    this.app = app;
    this.powerUps = powerUps;

    app.inSim.on(PacketType.ISP_OBH, this.onObjectHit);
  }

  private onObjectHit = (packet: IS_OBH, inSim: InSim) => {
    const RACE_CONTROL_MESSAGE_DURATION_MS = 3000;

    const triggerObjects: ObjectIndex[] = [
      ObjectIndex.AXO_CONE_GREEN,
      ObjectIndex.AXO_CONE_RED,
      ObjectIndex.AXO_CONE_BLUE,
      ObjectIndex.AXO_CONE_YELLOW,
    ];

    const isLayoutObject = packet.OBHFlags & ObjectHitFlags.OBH_LAYOUT;
    const isObjectOnSpot = packet.OBHFlags & ObjectHitFlags.OBH_ON_SPOT;
    const isTriggerObject = triggerObjects.includes(packet.Index);

    if (!isLayoutObject || !isTriggerObject || !isObjectOnSpot) {
      return;
    }

    const randomPowerUpId = Math.floor(Math.random() * this.powerUps.length);
    const randomPowerUp = this.powerUps[randomPowerUpId];
    randomPowerUp.execute(packet, inSim);

    const targetConnection = this.app.playersAndConnections.getConnectionByPLID(
      packet.PLID,
    );
    const userName = targetConnection?.UName;

    if (!userName) {
      log(`Error: No connection found for PLID ${packet.PLID}`);
      return;
    }

    inSim.send(new IS_MTC({ UCID: 255, Text: `${userName} got a power-up!` }));

    this.app.sendRaceControlMessage(
      userName,
      randomPowerUp.name,
      RACE_CONTROL_MESSAGE_DURATION_MS,
    );
  };
}
