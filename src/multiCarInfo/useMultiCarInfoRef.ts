import { type CompCar, PacketType } from "node-insim/packets";
import { useRef } from "react";
import { useOnPacket } from "react-node-insim";

import type { PlayerId } from "../types";

type MultiCarInfo = Record<PlayerId, CompCar>;

export function useMultiCarInfoRef() {
  const multiCarInfoRef = useRef<MultiCarInfo>({});

  useOnPacket(PacketType.ISP_MCI, (packet) => {
    packet.Info.forEach((compCar) => {
      multiCarInfoRef.current[compCar.PLID] = compCar;
    });
  });

  return multiCarInfoRef;
}
