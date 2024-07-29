import { IS_MTC, MessageSound } from "node-insim/packets";
import { useOnConnect } from "react-node-insim";

import { ButtonsForEachConnection } from "./components/ButtonsForEachConnection";
import { GlobalButton } from "./components/GlobalButton";
import { GlobalProviders } from "./GlobalProviders";
import { log } from "./log";
import { PowerUpList } from "./modules/powerUps/list/PowerUpList";
import { PowerUps } from "./modules/powerUps/PowerUps";

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
      <ButtonsForEachConnection>
        <PowerUps />
      </ButtonsForEachConnection>
      <PowerUpList />
      <AppName name={name} />
    </GlobalProviders>
  );
}

function AppName({ name }: AppProps) {
  return (
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
  );
}
