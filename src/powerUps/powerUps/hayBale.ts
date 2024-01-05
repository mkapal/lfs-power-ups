import { ObjectIndex, ObjectInfo } from "node-insim/packets";

import { getPointDirectlyBehind } from "../../utils";
import type { PowerUpExecutor } from "../types";

export const hayBale: PowerUpExecutor = ({ packet, layout }) => {
  const objectDistanceMeters = 3;
  const objectCoordinates = getPointDirectlyBehind(
    packet.C,
    objectDistanceMeters,
  );
  const baleObject = new ObjectInfo({
    Index: ObjectIndex.AXO_BALE,
    X: objectCoordinates.x,
    Y: objectCoordinates.y,
    Zbyte: objectCoordinates.z,
    Heading: packet.C.Heading,
  });

  layout.spawnObjectForTime(baleObject, 10_000);
};
