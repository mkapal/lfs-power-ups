import { IS_MTC, MessageSound } from "node-insim/packets";
import { useOnConnect } from "react-node-insim";

import { GlobalButton } from "@/components/GlobalButton";
import { GlobalProviders } from "@/GlobalProviders";
import { PowerUpList } from "@/modules/powerUps/list/PowerUpList";
import { PowerUpsForConnection } from "@/modules/powerUps/PowerUpsForConnection";

import { ButtonsByConnection } from "./components/ButtonsByConnection";
import { log } from "./log";

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
    <GlobalProviders>
      <ButtonsByConnection>
        <PowerUpsForConnection />
      </ButtonsByConnection>
      <PowerUpList />
      <GlobalButton
        top={195}
        left={1}
        width={20}
        height={3}
        color="selected"
        align="left"
      >
        {name}
      </GlobalButton>
    </GlobalProviders>
  );
}
