import { IS_MTC } from "node-insim/packets";

import type { CommonDependencies } from "../application";

type Dependencies = CommonDependencies;

export const sendMessageToConnection =
  ({ inSim }: Dependencies) =>
  (UCID: number, text: string) => {
    inSim.send(new IS_MTC({ UCID, Text: text }));
  };
