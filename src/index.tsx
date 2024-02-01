import "./env.ts";

import { InSimFlags } from "node-insim/packets";
import type { CreateRootOptions } from "react-node-insim";
import { createRoot } from "react-node-insim";

import { App } from "./App";

const appName = "LFS PowerUps";
const rootOptions: CreateRootOptions = {
  name: appName,
  host: process.env.HOST ?? "127.0.0.1",
  port: parseInt(process.env.PORT ?? "29999", 10),
  adminPassword: process.env.ADMIN,
  flags: InSimFlags.ISF_OBH | InSimFlags.ISF_HLV | InSimFlags.ISF_MCI,
  interval: 100,
};

createRoot(rootOptions).render(<App name={appName} />);
