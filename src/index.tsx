import "./env.ts";

import { InSimFlags } from "node-insim/packets";
import {
  ConnectionsProvider,
  createRoot,
  PlayersProvider,
} from "react-node-insim";

import { App } from "./App";

createRoot({
  name: "LFS PowerUps",
  host: process.env.HOST ?? "127.0.0.1",
  port: parseInt(process.env.PORT ?? "29999", 10),
  adminPassword: process.env.ADMIN,
  flags: InSimFlags.ISF_OBH | InSimFlags.ISF_HLV,
}).render(
  <ConnectionsProvider>
    <PlayersProvider>
      <App />
    </PlayersProvider>
  </ConnectionsProvider>,
);
