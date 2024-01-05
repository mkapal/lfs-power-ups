import { IS_MTC, MessageSound } from "node-insim/packets";
import { Button, useOnConnect } from "react-node-insim";

import { log } from "./log";
import { usePowerUps } from "./powerUps";

const appName = "LFS PowerUps v0.0.1";

export function App() {
  useOnConnect((packet, inSim) => {
    log(`Connected to LFS ${packet.Product} ${packet.Version}`);
    inSim.send(
      new IS_MTC({
        UCID: 255,
        Sound: MessageSound.SND_SYSMESSAGE,
        Text: `${appName} connected`,
      }),
    );
  });

  usePowerUps();

  return (
    <>
      <Button
        top={195}
        left={1}
        width={20}
        height={3}
        UCID={255}
        color="selected"
        align="left"
      >
        {appName}
      </Button>
    </>
  );
}
