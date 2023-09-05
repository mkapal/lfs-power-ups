import { IS_NCN, IS_NPL, PacketType, PlayerType } from "node-insim/packets";
import { InSim } from "node-insim";
import { log } from "../log";

type Connection = Pick<
  IS_NCN,
  "UCID" | "UName" | "PName" | "Admin" | "Total" | "Flags"
> & {};

type Player = Pick<
  IS_NPL,
  "UCID" | "PLID" | "PName" | "Flags" | "PType" | "Plate"
> & {};

export class PlayersAndConnections {
  private readonly inSim: InSim;
  private readonly connections = new Map<number, Connection>();
  private readonly players = new Map<number, Player>();

  constructor(inSim: InSim) {
    this.inSim = inSim;

    this.watchPlayers();
    this.watchConnections();
  }

  getConnections(): Connection[] {
    return Array.from(this.connections.values());
  }

  getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  getConnectionByPLID(plid: number): Connection | null {
    const player = this.getPlayers().find((player) => player.PLID === plid);

    if (!player) {
      log(`Player ${plid} not found`);
      return null;
    }

    const connection = this.connections.get(player.UCID);

    if (!connection) {
      log(`Connection for player ${plid} not found`);
      return null;
    }

    return connection;
  }

  private watchConnections() {
    // New connection
    this.inSim.on(PacketType.ISP_NCN, (packet) => {
      log(
        `New connection: ${packet.UName} - ${packet.PName} (${packet.UCID}) `,
      );
      this.connections.set(packet.UCID, {
        UCID: packet.UCID,
        UName: packet.UName,
        PName: packet.PName,
        Admin: packet.Admin,
        Total: packet.Total,
        Flags: packet.Flags,
      });
    });

    // Connection leave
    this.inSim.on(PacketType.ISP_CNL, (packet) => {
      log(`Connection ${packet.UCID} left`);
      this.connections.delete(packet.UCID);
    });

    // Player rename
    this.inSim.on(PacketType.ISP_CPR, (packet) => {
      const foundConnection = this.connections.get(packet.UCID);

      if (!foundConnection) {
        return;
      }

      log(`Connection ${packet.UCID} renamed to ${packet.PName}`);

      this.connections.set(foundConnection.UCID, {
        ...foundConnection,
        PName: packet.PName,
      });

      this.players.forEach((player) => {
        if (player.UCID !== packet.UCID) {
          return;
        }

        if (Boolean(player.PType & PlayerType.AI)) {
          return;
        }

        this.players.set(player.PLID, {
          ...player,
          PName: packet.PName,
          Plate: packet.Plate,
        });
      });
    });
  }

  private watchPlayers() {
    // New player
    this.inSim.on(PacketType.ISP_NPL, (packet) => {
      log(`New player: ${packet.PName} (${packet.PLID})`);
      this.players.set(packet.PLID, {
        UCID: packet.UCID,
        PLID: packet.PLID,
        PName: packet.PName,
        PType: packet.PType,
        Plate: packet.Plate,
        Flags: packet.Flags,
      });
    });

    // Player leave
    this.inSim.on(PacketType.ISP_PLL, (packet) => {
      log(`Player ${packet.PLID} left`);
      this.players.delete(packet.PLID);
    });

    // Player take over car
    this.inSim.on(PacketType.ISP_TOC, (packet) => {
      const foundPlayer = this.players.get(packet.PLID);
      if (!foundPlayer) {
        return;
      }

      log(
        `Player ${packet.PLID} (UCID ${packet.NewUCID}) took over car UCID ${packet.OldUCID}`,
      );

      this.players.set(foundPlayer.PLID, {
        ...foundPlayer,
        UCID: packet.NewUCID,
      });
    });
  }
}
