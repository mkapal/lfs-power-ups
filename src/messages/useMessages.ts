import type { MessageSound } from "node-insim/packets";
import { IS_MST, IS_MTC } from "node-insim/packets";
import { useInSim } from "react-node-insim";

export function useMessages() {
  const inSim = useInSim();

  const sendMessageToConnection = (
    UCID: number,
    text: string,
    sound?: MessageSound,
  ) => {
    inSim.send(new IS_MTC({ UCID, Text: text, Sound: sound }));
  };

  const sendRaceControlMessage = (
    userName: string,
    text: string,
    timeout?: number,
  ) => {
    inSim.send(new IS_MST({ Msg: `/rcm ${text}` }));
    inSim.send(new IS_MST({ Msg: `/rcm_ply ${userName}` }));

    if (timeout) {
      setTimeout(() => {
        inSim.send(new IS_MST({ Msg: `/rcc_ply ${userName}` }));
      }, timeout);
    }
  };

  return {
    sendMessageToConnection,
    sendRaceControlMessage,
  };
}
