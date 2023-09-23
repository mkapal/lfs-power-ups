import type { InSim } from "node-insim";
import type { IS_NPL } from "node-insim/packets";
import { IS_TINY, PacketType, TinyType } from "node-insim/packets";

import type { CommonDependencies } from "../../application";

export type Player = Pick<
  IS_NPL,
  "UCID" | "PLID" | "PName" | "Flags" | "PType" | "Plate"
> & {
  //
};

type Dependencies = CommonDependencies;

export const playerList = ({
  inSim,
  log,
}: Dependencies): Map<number, Player> => {
  const players = new Map<number, Player>();
  const deps = { inSim, log };

  requestAllPlayers(deps);
  watchPlayers(deps)(players);

  return players;
};

const watchPlayers =
  (deps: CommonDependencies) => (players: Map<number, Player>) => {
    const { inSim, log } = deps;
    log("Watching players");

    // New player
    inSim.on(PacketType.ISP_NPL, (packet) => {
      log(`New player: ${packet.PName} (${packet.PLID})`);
      players.set(packet.PLID, {
        UCID: packet.UCID,
        PLID: packet.PLID,
        PName: packet.PName,
        PType: packet.PType,
        Plate: packet.Plate,
        Flags: packet.Flags,
      });
    });

    watchPlayersLeaving(deps)(players);
    watchPlayersTakingOverCars(deps)(players);
  };

const requestAllPlayers = ({ inSim, log }: CommonDependencies) => {
  inSim.on(PacketType.ISP_VER, (_, inSim: InSim) => {
    log("Requesting players");
    inSim.send(new IS_TINY({ ReqI: 1, SubT: TinyType.TINY_NPL }));
  });
};

const watchPlayersLeaving =
  ({ inSim, log }: CommonDependencies) =>
  (players: Map<number, Player>) => {
    inSim.on(PacketType.ISP_PLL, (packet) => {
      log(`Player ${packet.PLID} left`);
      players.delete(packet.PLID);
    });
  };

const watchPlayersTakingOverCars =
  ({ inSim, log }: CommonDependencies) =>
  (players: Map<number, Player>) => {
    inSim.on(PacketType.ISP_TOC, (packet) => {
      const foundPlayer = players.get(packet.PLID);
      if (!foundPlayer) {
        return;
      }

      log(
        `Player ${packet.PLID} (UCID ${packet.NewUCID}) took over car UCID ${packet.OldUCID}`,
      );

      players.set(foundPlayer.PLID, {
        ...foundPlayer,
        UCID: packet.NewUCID,
      });
    });
  };
