import { type CompCar, PacketType } from "node-insim/packets";
import { useOnPacket } from "react-node-insim";

import type { PlayerId } from "../types";

type MultiCarInfo = Record<PlayerId, CompCar>;

const multiCarInfo: MultiCarInfo = {};

export function useMultiCarInfoRef() {
  useOnPacket(PacketType.ISP_MCI, (packet) => {
    packet.Info.forEach((compCar) => {
      multiCarInfo[compCar.PLID] = compCar;
    });
  });

  return multiCarInfo;
}
