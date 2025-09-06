import "./setupEnvironment";

import { InSim } from "node-insim";
import { InSimFlags, IS_ISI_ReqI } from "node-insim/packets";
import { createRoot } from "react-node-insim";

import { App } from "./App";

const appName = "LFS PowerUps";

const inSim = new InSim();
inSim.connect({
  IName: appName,
  Host: process.env.HOST ?? "127.0.0.1",
  Port: parseInt(process.env.PORT ?? "29999", 10),
  ReqI: IS_ISI_ReqI.SEND_VERSION,
  Admin: process.env.ADMIN,
  Flags: InSimFlags.ISF_OBH | InSimFlags.ISF_HLV | InSimFlags.ISF_MCI,
  Interval: 100,
});

const root = createRoot(inSim, {
  buttonClickIDStart: parseInt(process.env.BUTTON_CLICK_ID_START ?? "0", 10),
});
root.render(<App name={appName} />);
