import { Fragment } from "react";
import { Button, HStack, usePlayers } from "react-node-insim";

import { useActivePowerUps } from "../activeList/ActivePowerUpsContext";

export function ActivePowerUps() {
  const players = usePlayers();
  const { activePowerUpsByPlayer } = useActivePowerUps();

  const height = 5;
  const left = 150;
  const top = 0;

  return (
    <>
      {players.map((player) => {
        const activePowerUps = activePowerUpsByPlayer[player.PLID] ?? [];

        return (
          <Fragment key={player.PLID}>
            <Button
              UCID={player.UCID}
              width={20}
              height={height}
              left={left}
              top={top}
              align="left"
              color="title"
            >
              Active power-ups
            </Button>
            {activePowerUps.map((powerUp, index) => (
              <HStack
                key={`${powerUp.id}-${powerUp.queueId}`}
                UCID={player.UCID}
                top={top + height * (index + 1)}
                left={left}
                height={height}
                variant="dark"
              >
                <Button width={14}>{powerUp.name}</Button>
                <Button width={4}>
                  {(powerUp.timeRemainingMs / 1000).toFixed(0)}
                </Button>
              </HStack>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
