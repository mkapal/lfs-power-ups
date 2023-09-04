import {
  IS_AXM,
  IS_OBH,
  ObjectIndex,
  ObjectInfo,
  PMOAction,
} from "node-insim/packets";
import { InSim } from "node-insim";
import { lfsAngleToRadians } from "../helpers";
import { PowerUp } from "./PowerUps";

export const defaultPowerUps: PowerUp[] = [
  {
    name: "^3Hay ^2Bale!",
    action: (packet: IS_OBH, inSim: InSim) => {
      const radiusMetres = 3 * 16;
      const headingRadians = lfsAngleToRadians(packet.C.Heading);
      const x =
        packet.C.X + radiusMetres * Math.cos(headingRadians + Math.PI / 2);
      const y =
        packet.C.Y + radiusMetres * Math.sin(headingRadians + Math.PI / 2);

      const bale = new ObjectInfo({
        Index: ObjectIndex.AXO_BALE,
        X: x,
        Y: y,
        Zbyte: packet.C.Zbyte,
        Heading: packet.C.Heading,
      });
      inSim.send(
        new IS_AXM({
          PMOAction: PMOAction.PMO_ADD_OBJECTS,
          NumO: 1,
          Info: [bale],
        }),
      );

      setTimeout(() => {
        inSim.send(
          new IS_AXM({
            PMOAction: PMOAction.PMO_DEL_OBJECTS,
            NumO: 1,
            Info: [bale],
          }),
        );
      }, 1000);
    },
  },
];
