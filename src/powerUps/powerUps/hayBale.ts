import type { CarContOBJ } from "node-insim/packets";
import { IS_AXM, ObjectIndex, ObjectInfo, PMOAction } from "node-insim/packets";

import type { Point3D } from "../../types";
import { lfsAngleToRadians } from "../../utils";
import type { PowerUp } from "../types";

export const hayBale: PowerUp = {
  name: "^3Hay Bale!",
  execute: (packet, inSim) => {
    const objectCoordinates = calculateCoordinatesBehindCar(packet.C, 3);
    const baleObject = createBaleObject(objectCoordinates, packet.C.Heading);
    spawnObjectForTime(baleObject, 10_000);

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

    function createBaleObject(
      { x, y, z }: Point3D,
      heading: number,
    ): ObjectInfo {
      return new ObjectInfo({
        Index: ObjectIndex.AXO_BALE,
        X: x,
        Y: y,
        Zbyte: z,
        Heading: heading,
      });
    }

    function spawnObjectForTime(object: ObjectInfo, timeoutMs: number) {
      addObject(object);
      setTimeout(() => {
        deleteObject(object);
      }, timeoutMs);
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

    function deleteObject(object: ObjectInfo) {
      inSim.send(
        new IS_AXM({
          PMOAction: PMOAction.PMO_DEL_OBJECTS,
          NumO: 1,
          Info: [object],
        }),
      );
    }
  },
};
