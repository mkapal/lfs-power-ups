import type { CommonDependencies } from "../application";
import type { Connection } from "./connections";
import { connectionList } from "./connections";
import type { Player } from "./players";
import { playerList } from "./players";

export type RaceTracking = {
  getPlayers: () => Player[];
  getConnections: () => Connection[];
  getConnectionByPLID: (plid: number) => Connection | null;
};

type Dependencies = CommonDependencies;

export function raceTracking(deps: Dependencies): RaceTracking {
  const log = deps.log.extend("raceTracking");

  const depsWithLogger = { ...deps, log };

  const players = playerList(depsWithLogger);
  const connections = connectionList({
    ...depsWithLogger,
    players,
  });

  const getPlayers = () => Array.from(players.values());
  const getConnections = () => Array.from(connections.values());

  return {
    getPlayers: getPlayers,
    getConnections: getConnections,
    getConnectionByPLID: getConnectionByPLID({
      connections,
      getPlayers,
      log,
    }),
  };
}

const getConnectionByPLID =
  ({
    connections,
    getPlayers,
    log,
  }: {
    connections: Map<number, Connection>;
    getPlayers: () => Player[];
    log: CommonDependencies["log"];
  }) =>
  (plid: number): Connection | null => {
    const player = getPlayers().find((player) => player.PLID === plid);

    if (!player) {
      log(`Player ${plid} not found`);
      return null;
    }

    const connection = connections.get(player.UCID);

    if (!connection) {
      log(`Connection for player ${plid} not found`);
      return null;
    }

    return connection;
  };
