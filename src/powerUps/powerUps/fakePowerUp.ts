import type { CarContOBJ } from "node-insim/packets";
import { IS_AXM, ObjectIndex, ObjectInfo, PMOAction } from "node-insim/packets";

import type { Point3D } from "../../types";
import { lfsAngleToRadians } from "../../utils";
import type { PowerUp } from "../types";

export const fakePowerUp: PowerUp = {
  name: "^3Fake PowerUp!",
  execute: (packet, inSim) => {
    const objectCoordinates = calculateCoordinatesBehindCar(packet.C, 3);
    const coneObject = createConeObject(objectCoordinates, packet.C.Heading);
    addObject(coneObject);

    function calculateCoordinatesBehindCar(
      carContact: CarContOBJ,
      radiusInMeters: number,
    ): Point3D {
      const radius = radiusInMeters * 16;
      const headingRadians = lfsAngleToRadians(carContact.Heading);
      const x = carContact.X + radius * Math.cos(headingRadians + Math.PI / 2);
      const y = carContact.Y + radius * Math.sin(headingRadians + Math.PI / 2);
      const z = carContact.Zbyte;

      return {
        x,
        y,
        z,
      };
    }

    function createConeObject(
      { x, y, z }: Point3D,
      heading: number,
    ): ObjectInfo {
      return new ObjectInfo({
        Index: ObjectIndex.AXO_CONE_RED,
        X: x,
        Y: y,
        Zbyte: z,
        Heading: heading,
      });
    }

    function addObject(object: ObjectInfo) {
      inSim.send(
        new IS_AXM({
          PMOAction: PMOAction.PMO_ADD_OBJECTS,
          NumO: 1,
          Info: [object],
        }),
      );
    }
  },
};
