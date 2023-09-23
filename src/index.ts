import "./env.ts";

import debug from "debug";
import { InSim } from "node-insim";

import * as application from "./application";

application.run(
  {
    log: debug("lfs-power-ups"),
    inSim: new InSim(),
  },
  "LFS PowerUps",
);
