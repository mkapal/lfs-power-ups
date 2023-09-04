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

export type PowerUp = {
  name: string;
  action: (packet: IS_OBH, inSim: InSim) => void;
};

export class PowerUps {
  private readonly app: App;
  private readonly powerUps: PowerUp[] = [];

  constructor(app: App, powerUps: PowerUp[]) {
    this.app = app;
    this.powerUps = powerUps;

    app.inSim.on(PacketType.ISP_OBH, this.onObjectHit);
  }

  private onObjectHit = (packet: IS_OBH, inSim: InSim) => {
    const isObjectOnSpot = packet.OBHFlags & ObjectHitFlags.OBH_ON_SPOT;
    const isLayoutObject = packet.OBHFlags & ObjectHitFlags.OBH_LAYOUT;

    if (
      isLayoutObject &&
      packet.Index === ObjectIndex.AXO_CONE_GREEN &&
      isObjectOnSpot
    ) {
      const randomPowerUp =
        this.powerUps[Math.floor(Math.random() * this.powerUps.length)];

      randomPowerUp.action(packet, inSim);

      const connection = this.app.playersAndConnections.getConnectionByPLID(
        packet.PLID,
      );
      const playerName = connection?.PName;

      if (!playerName) {
        log(`Error: No connection found for PLID ${packet.PLID}`);
        return;
      }

      inSim.send(
        new IS_MTC({ UCID: 255, Text: `${playerName} got a power-up!` }),
      );

      this.app.sendRaceControlMessage(randomPowerUp.name, playerName, 3000);
    }
  };
}
