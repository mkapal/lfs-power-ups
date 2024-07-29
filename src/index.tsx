import "./setupEnvironment";

import { InSimFlags } from "node-insim/packets";
import { createRoot } from "react-node-insim";

import { App } from "./App";

const appName = "LFS PowerUps";
const root = createRoot({
  name: appName,
  host: process.env.HOST ?? "127.0.0.1",
  port: parseInt(process.env.PORT ?? "29999", 10),
  adminPassword: process.env.ADMIN,
  flags: InSimFlags.ISF_OBH | InSimFlags.ISF_HLV | InSimFlags.ISF_MCI,
  interval: 100,
  buttonClickIDStart: parseInt(process.env.BUTTON_CLICK_ID_START ?? "0", 10),
});
root.render(<App name={appName} />);
