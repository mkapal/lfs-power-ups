import type { CarContOBJ } from "node-insim/packets";

import type { Point3D } from "../types";
import { lfsAngleToRadians } from "./lfs";

export function getPointDirectlyBehind(
  referencePoint: CarContOBJ,
  radiusInMeters: number,
): Point3D {
  const radius = radiusInMeters * 16;
  const headingRadians = lfsAngleToRadians(referencePoint.Heading);
  const x = referencePoint.X + radius * Math.cos(headingRadians + Math.PI / 2);
  const y = referencePoint.Y + radius * Math.sin(headingRadians + Math.PI / 2);
  const z = referencePoint.Zbyte;

  return {
    x,
    y,
    z,
  };
}
