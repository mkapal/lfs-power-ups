import type { InSim } from "node-insim";
import type { IS_NCN } from "node-insim/packets";
import { IS_TINY, PacketType, PlayerType, TinyType } from "node-insim/packets";

import type { CommonDependencies } from "../../application";
import type { Player } from "../players";

export type Connection = Pick<
  IS_NCN,
  "UCID" | "UName" | "PName" | "Admin" | "Total" | "Flags"
> & {
  //
};

type Dependencies = CommonDependencies & {
  players: Map<number, Player>;
};

export const connectionList = ({
  inSim,
  log,
  players,
}: Dependencies): Map<number, Connection> => {
  const connections = new Map<number, Connection>();
  const deps = { inSim, log };

  requestAllConnections(deps);
  watchConnections(deps)(connections, players);

  return connections;
};

const watchConnections =
  (deps: CommonDependencies) =>
  (connections: Map<number, Connection>, players: Map<number, Player>) => {
    const { log } = deps;
    log("Watching connections");

    watchNewConnections(deps)(connections);
    watchConnectionsLeaving(deps)(connections);
    watchPlayersRenaming(deps)(connections, players);
  };

const requestAllConnections = ({ inSim, log }: CommonDependencies) => {
  inSim.on(PacketType.ISP_VER, (_, inSim: InSim) => {
    log("Requesting connections");
    inSim.send(new IS_TINY({ ReqI: 1, SubT: TinyType.TINY_NCN }));
  });
};

const watchNewConnections =
  ({ inSim, log }: CommonDependencies) =>
  (connections: Map<number, Connection>) => {
    inSim.on(PacketType.ISP_NCN, (packet) => {
      log(
        `New connection: ${packet.UName} - ${packet.PName} (${packet.UCID}) `,
      );
      connections.set(packet.UCID, {
        UCID: packet.UCID,
        UName: packet.UName,
        PName: packet.PName,
        Admin: packet.Admin,
        Total: packet.Total,
        Flags: packet.Flags,
      });
    });
  };

const watchConnectionsLeaving =
  ({ inSim, log }: CommonDependencies) =>
  (connections: Map<number, Connection>) => {
    inSim.on(PacketType.ISP_CNL, (packet) => {
      log(`Connection ${packet.UCID} left`);
      connections.delete(packet.UCID);
    });
  };

const watchPlayersRenaming =
  ({ inSim, log }: CommonDependencies) =>
  (connections: Map<number, Connection>, players: Map<number, Player>) => {
    inSim.on(PacketType.ISP_CPR, (packet) => {
      const foundConnection = connections.get(packet.UCID);

      if (!foundConnection) {
        return;
      }

      log(`Connection ${packet.UCID} renamed to ${packet.PName}`);

      connections.set(foundConnection.UCID, {
        ...foundConnection,
        PName: packet.PName,
      });

      players.forEach((player) => {
        if (player.UCID !== packet.UCID) {
          return;
        }

        if (player.PType & PlayerType.AI) {
          return;
        }

        players.set(player.PLID, {
          ...player,
          PName: packet.PName,
          Plate: packet.Plate,
        });
      });
    });
  };
