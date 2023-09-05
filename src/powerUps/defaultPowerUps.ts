import { HayBale } from "./HayBale";
import { PowerUp } from "./PowerUp";
import { InSim } from "node-insim";

export const defaultPowerUps: (inSim: InSim) => PowerUp[] = (inSim) => [
  new HayBale(inSim),
];
