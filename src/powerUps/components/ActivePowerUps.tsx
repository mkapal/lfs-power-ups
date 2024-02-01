import { Fragment } from "react";
import { Button, usePlayers, VStack } from "react-node-insim";

import { usePowerUpQueue } from "../queue/PowerUpQueueContext";

export function ActivePowerUps() {
  const players = usePlayers();
  const { powerUpQueueByPlayer } = usePowerUpQueue();

  const width = 30;
  const height = 5;
  const left = 75;
  const top = 15;

  return (
    <>
      {players.map((player) => {
        const activePowerUps = powerUpQueueByPlayer[player.PLID] ?? [];

        return (
          <Fragment key={player.PLID}>
            <Button
              UCID={player.UCID}
              left={left - 4}
              top={top + height}
              width={4}
              height={height}
              variant="dark"
            >
              ▶
            </Button>
            <Button
              UCID={player.UCID}
              left={left + width}
              top={top + height}
              width={4}
              height={height}
              variant="dark"
            >
              ◀
            </Button>
            <Button
              UCID={player.UCID}
              width={width}
              height={height}
              left={left}
              top={top}
              variant="light"
            >
              Active power-ups: {player.PName}
            </Button>
            <VStack
              UCID={player.UCID}
              left={left}
              top={top + height}
              width={width}
              height={height}
              variant="dark"
            >
              {activePowerUps.map((powerUp) => (
                <Button key={`${powerUp.id}-${powerUp.queueId}`}>
                  {powerUp.name}
                </Button>
              ))}
            </VStack>
          </Fragment>
        );
      })}
    </>
  );
}
