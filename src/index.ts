import "./env.ts";

import { InSim } from "node-insim";
import { log } from "./log";
import { PowerUps, defaultPowerUps } from "./powerUps";
import {
  InSimFlags,
  IS_ISI_ReqI,
  PacketType,
  IS_TINY,
  IS_VER,
  TinyType,
} from "node-insim/packets";
import { App } from "./App";

const inSim = new InSim();

inSim.connect({
  IName: "LFS Carmageddon",
  Host: process.env.HOST ?? "127.0.0.1",
  Port: process.env.PORT ? parseInt(process.env.PORT) : 29999,
  ReqI: IS_ISI_ReqI.SEND_VERSION,
  Admin: process.env.ADMIN ?? "",
  Flags: InSimFlags.ISF_OBH,
});

inSim.on("connect", () => log("Connected"));
inSim.on("disconnect", () => log("Disconnected"));

inSim.on(PacketType.ISP_VER, onVersion);

function onVersion(packet: IS_VER, inSim: InSim) {
  logVersion(packet);
  requestPlayersAndConnections(inSim);

  const app = new App(inSim);
  new PowerUps(app, defaultPowerUps);
}

function logVersion(packet: IS_VER) {
  log(`Connected to LFS ${packet.Product} ${packet.Version}`);
}

function requestPlayersAndConnections(inSim: InSim) {
  inSim.send(
    new IS_TINY({
      ReqI: 1,
      SubT: TinyType.TINY_NPL,
    }),
  );
  inSim.send(
    new IS_TINY({
      ReqI: 1,
      SubT: TinyType.TINY_NCN,
    }),
  );
}

process.on("uncaughtException", (error) => {
  log(error);
});
