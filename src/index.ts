import "./env.ts";

import debug from "debug";
import { InSim } from "node-insim";
import type { IS_VER } from "node-insim/packets";
import { IS_ISI_ReqI, IS_OBH, PacketType } from "node-insim/packets";

const log = debug("lfs-carmageddon");

const inSim = new InSim();

inSim.connect({
  IName: "Node InSim App",
  Host: process.env.HOST ?? "127.0.0.1",
  Port: process.env.PORT ? parseInt(process.env.PORT) : 29999,
  ReqI: IS_ISI_ReqI.SEND_VERSION,
  Admin: process.env.ADMIN ?? "",
});

inSim.on("connect", () => log("Connected"));
inSim.on("disconnect", () => log("Disconnected"));

inSim.on(PacketType.ISP_VER, onVersion);
inSim.on(PacketType.ISP_OBH, onObjectHit);

function onVersion(packet: IS_VER) {
  log(`Connected to LFS ${packet.Product} ${packet.Version}`);
}

function onObjectHit(packet: IS_OBH) {}

process.on("uncaughtException", (error) => {
  log(error);
});
