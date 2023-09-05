import {
  CarContOBJ,
  IS_AXM,
  IS_OBH,
  ObjectIndex,
  ObjectInfo,
  PMOAction,
} from "node-insim/packets";
import { InSim } from "node-insim";
import { lfsAngleToRadians } from "../../helpers";
import { Point3D } from "../../types";
import { PowerUp } from "../PowerUp";

export class HayBale extends PowerUp {
  constructor(inSim: InSim) {
    super(inSim, "^3Hay ^2Bale!");
  }

  execute(packet: IS_OBH): void {
    const DISTANCE_FROM_CAR_IN_METERS = 3;
    const OBJECT_SPAWN_TIME_MS = 3_000;

    const objectCoordinates = this.calculateCoordinatesBehindCar(
      packet.C,
      DISTANCE_FROM_CAR_IN_METERS,
    );

    const baleObject = this.createBaleObject(
      objectCoordinates,
      packet.C.Heading,
    );

    this.spawnObjectForTime(baleObject, OBJECT_SPAWN_TIME_MS);
  }

  private calculateCoordinatesBehindCar(
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

  private createBaleObject({ x, y, z }: Point3D, heading: number): ObjectInfo {
    return new ObjectInfo({
      Index: ObjectIndex.AXO_BALE,
      X: x,
      Y: y,
      Zbyte: z,
      Heading: heading,
    });
  }

  private spawnObjectForTime(object: ObjectInfo, timeoutMs: number) {
    this.addObject(object);
    setTimeout(() => {
      this.deleteObject(object);
    }, timeoutMs);
  }

  private addObject(object: ObjectInfo) {
    this.inSim.send(
      new IS_AXM({
        PMOAction: PMOAction.PMO_ADD_OBJECTS,
        NumO: 1,
        Info: [object],
      }),
    );
  }

  private deleteObject(object: ObjectInfo) {
    this.inSim.send(
      new IS_AXM({
        PMOAction: PMOAction.PMO_DEL_OBJECTS,
        NumO: 1,
        Info: [object],
      }),
    );
  }
}
