import type { InSim } from "node-insim";
import type { CarContOBJ, IS_OBH } from "node-insim/packets";
import { IS_AXM, ObjectIndex, ObjectInfo, PMOAction } from "node-insim/packets";

import type { CommonDependencies } from "../../application";
import type { Point3D } from "../../types";
import { lfsAngleToRadians } from "../../utils";
import type { PowerUp } from "../types";

type Dependencies = CommonDependencies["log"];

export const hayBale: PowerUp = {
  name: "^3Hay ^2Bale!",
  execute: (log: Dependencies) => (packet: IS_OBH, inSim: InSim) => {
    log("Hay Bale");

    const DISTANCE_FROM_CAR_IN_METERS = 3;
    const OBJECT_SPAWN_TIME_MS = 3_000;

    const objectCoordinates = calculateCoordinatesBehindCar(
      packet.C,
      DISTANCE_FROM_CAR_IN_METERS,
    );

    const baleObject = createBaleObject(objectCoordinates, packet.C.Heading);

    spawnObjectForTime(inSim)(baleObject, OBJECT_SPAWN_TIME_MS);
  },
};

const calculateCoordinatesBehindCar = (
  carContact: CarContOBJ,
  radiusInMeters: number,
): Point3D => {
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
};

const createBaleObject = ({ x, y, z }: Point3D, heading: number): ObjectInfo =>
  new ObjectInfo({
    Index: ObjectIndex.AXO_BALE,
    X: x,
    Y: y,
    Zbyte: z,
    Heading: heading,
  });

const spawnObjectForTime =
  (inSim: InSim) => (object: ObjectInfo, timeoutMs: number) => {
    addObject(inSim)(object);
    setTimeout(() => {
      deleteObject(inSim)(object);
    }, timeoutMs);
  };

const addObject = (inSim: InSim) => (object: ObjectInfo) => {
  inSim.send(
    new IS_AXM({
      PMOAction: PMOAction.PMO_ADD_OBJECTS,
      NumO: 1,
      Info: [object],
    }),
  );
};

const deleteObject = (inSim: InSim) => (object: ObjectInfo) => {
  inSim.send(
    new IS_AXM({
      PMOAction: PMOAction.PMO_DEL_OBJECTS,
      NumO: 1,
      Info: [object],
    }),
  );
};
