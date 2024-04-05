import { IS_MTC, MessageSound } from "node-insim/packets";
import { Button, useOnConnect } from "react-node-insim";

import { log } from "./log";
import { PowerUps } from "./powerUps";

type AppProps = {
  name: string;
};

export function App({ name }: AppProps) {
  useOnConnect((packet, inSim) => {
    log(`Connected to LFS ${packet.Product} ${packet.Version}`);
    inSim.send(
      new IS_MTC({
        UCID: 255,
        Sound: MessageSound.SND_SYSMESSAGE,
        Text: `${name} connected`,
      }),
    );
  });

  return (
    <>
      <PowerUps />
      <Button
        top={195}
        left={1}
        width={20}
        height={3}
        UCID={255}
        color="selected"
        align="left"
      >
        {name}
      </Button>
    </>
  );
}
