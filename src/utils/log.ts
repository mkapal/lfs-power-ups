import debug from "debug";
import type { Player } from "react-node-insim";

export const log = debug("lfs-power-ups");

export const logPlayer = (player: Player) =>
  `${player.PName} (PLID ${player.PLID})`;
