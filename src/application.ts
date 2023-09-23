import type { Debugger } from "debug";
import type { InSim } from "node-insim";
import type { IS_VER } from "node-insim/packets";
import { InSimFlags, IS_ISI_ReqI, PacketType } from "node-insim/packets";

import { messageSystem } from "./messages";
import { powerUps } from "./powerUps";
import { hayBale } from "./powerUps/hayBale";
import { raceTracking } from "./raceTracking";

export type CommonDependencies = {
  log: Debugger;
  inSim: InSim;
};

export const run = (deps: CommonDependencies, name: string) => {
  const { log, inSim } = deps;

  log("Starting application");

  connect(inSim)({
    name,
    host: process.env.HOST ?? "127.0.0.1",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 29999,
    adminPassword: process.env.ADMIN ?? "",
  });

  inSim.on("connect", () => log("Connected to InSim"));
  inSim.on("disconnect", () => log("Disconnected from InSim"));

  inSim.on(PacketType.ISP_VER, (packet: IS_VER) => {
    log(`Connected to LFS ${packet.Product} ${packet.Version}`);
  });

  const messages = messageSystem(deps);
  const raceTrackingWithDeps = raceTracking(deps);
  const powerUpList = [hayBale];

  powerUps(
    {
      ...deps,
      messages,
      raceTracking: raceTrackingWithDeps,
    },
    powerUpList,
  );

  process.on("uncaughtException", (error) => {
    log(error);
  });
};

const connect =
  (inSim: InSim) =>
  (options: {
    name: string;
    host: string;
    port: number;
    adminPassword: string;
  }) => {
    inSim.connect({
      IName: options.name,
      Host: options.host,
      Port: options.port,
      ReqI: IS_ISI_ReqI.SEND_VERSION,
      Admin: options.adminPassword,
      Flags: InSimFlags.ISF_OBH,
    });
  };
