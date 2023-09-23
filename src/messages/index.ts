import type { CommonDependencies } from "../application";
import { sendMessageToConnection } from "./sendMessageToConnection";
import { sendRaceControlMessage } from "./sendRaceControlMessage";

export type MessageSystem = {
  sendMessageToConnection: (UCID: number, text: string) => void;
  sendRaceControlMessage: (
    userName: string,
    text: string,
    timeout?: number,
  ) => void;
};

type Dependencies = CommonDependencies;

export const messageSystem = (deps: Dependencies) => {
  const log = deps.log.extend("messageSystem");

  const depsWithLogger = { ...deps, log };

  return {
    sendMessageToConnection: sendMessageToConnection(depsWithLogger),
    sendRaceControlMessage: sendRaceControlMessage(depsWithLogger),
  };
};
