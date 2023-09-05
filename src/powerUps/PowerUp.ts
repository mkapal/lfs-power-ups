import { InSim } from "node-insim";
import { IS_OBH } from "node-insim/packets";

export abstract class PowerUp {
  protected readonly inSim: InSim;
  public readonly name: string;

  constructor(inSim: InSim, name: string) {
    this.inSim = inSim;
    this.name = name;
  }

  abstract execute(packet: IS_OBH, inSim: InSim): void;
}
