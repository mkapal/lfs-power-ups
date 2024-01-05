import { ObjectIndex, ObjectInfo } from "node-insim/packets";

import { getPointDirectlyBehind } from "../../utils";
import type { PowerUpExecutor } from "../types";

export const fakePowerUp: PowerUpExecutor = ({ packet, layout }) => {
  const objectDistanceMeters = 3;
  const objectCoordinates = getPointDirectlyBehind(
    packet.C,
    objectDistanceMeters,
  );
  const coneObject = new ObjectInfo({
    Index: ObjectIndex.AXO_CONE_RED,
    X: objectCoordinates.x,
    Y: objectCoordinates.y,
    Zbyte: objectCoordinates.z,
    Heading: packet.C.Heading,
  });
  layout.addObject(coneObject);
};
