import { PlayersAndConnections } from "./PlayersAndConnections";
import { InSim } from "node-insim";
import { IS_MST } from "node-insim/packets";

export class App {
  public readonly inSim: InSim;
  public readonly playersAndConnections: PlayersAndConnections;

  constructor(inSim: InSim) {
    this.inSim = inSim;
    this.playersAndConnections = new PlayersAndConnections(inSim);
  }

  public sendRaceControlMessage(
    userName: string,
    text: string,
    timeout?: number,
  ) {
    this.inSim.send(new IS_MST({ Msg: `/rcm ${text}` }));
    this.inSim.send(new IS_MST({ Msg: `/rcm_ply ${userName}` }));

    if (timeout) {
      setTimeout(() => {
        this.inSim.send(new IS_MST({ Msg: `/rcc_ply ${userName}` }));
      }, timeout);
    }
  }
}
