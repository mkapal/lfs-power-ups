import { IS_MST } from "node-insim/packets";

import type { CommonDependencies } from "../application";

type Dependencies = CommonDependencies;

export const sendRaceControlMessage =
  ({ inSim }: Dependencies) =>
  (userName: string, text: string, timeout?: number) => {
    inSim.send(new IS_MST({ Msg: `/rcm ${text}` }));
    inSim.send(new IS_MST({ Msg: `/rcm_ply ${userName}` }));

    if (timeout) {
      setTimeout(() => {
        inSim.send(new IS_MST({ Msg: `/rcc_ply ${userName}` }));
      }, timeout);
    }
  };
