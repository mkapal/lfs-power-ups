import { ObjectIndex, ObjectInfo } from "node-insim/packets";

import { log } from "@/log";
import { useLayout } from "@/modules/layout/useLayout";
import { useMultiCarInfoRef } from "@/modules/multiCarInfo/useMultiCarInfoRef";
import type { ManualPowerUpHook } from "@/modules/powerUps/types";
import { compCarAngleToRadians } from "@/utils";

export const useHayBale: ManualPowerUpHook = () => {
  const multiCarInfoRef = useMultiCarInfoRef();
  const layout = useLayout();

  const timeout = 5_000;

  return {
    name: "^3Hay Bale",
    timeout,
    isInstant: false,
    execute: ({ player }) => {
      const compCar = multiCarInfoRef[player.PLID];

      if (!compCar) {
        log(
          `Player ${player.PLID} failed to spawn hay bale - compCar info not found`,
        );
        return;
      }

      const compCarScaleXYZ = 65536;
      const layoutScaleXY = 16;
      const layoutScaleZ = 4;

      const radiusInMeters = 3 * compCarScaleXYZ;
      const headingRadians = compCarAngleToRadians(compCar.Heading);
      const x =
        compCar.X + radiusInMeters * Math.cos(headingRadians + Math.PI / 2);
      const y =
        compCar.Y + radiusInMeters * Math.sin(headingRadians + Math.PI / 2);
      const z = compCar.Z;

      const baleObject = new ObjectInfo({
        Index: ObjectIndex.AXO_BALE,
        X: x / (compCarScaleXYZ / layoutScaleXY),
        Y: y / (compCarScaleXYZ / layoutScaleXY),
        Zbyte: z / (compCarScaleXYZ / layoutScaleZ),
        Heading: compCar.Heading / 128,
      });

      layout.spawnObjectForTime(baleObject, timeout ?? 0);
    },
  };
};
