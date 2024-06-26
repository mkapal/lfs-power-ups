import { Fragment } from "react";
import { Button, usePlayers, VStack } from "react-node-insim";

import { usePowerUpQueue } from "../queue/PowerUpQueueContext";

export function PowerUpQueue() {
  const players = usePlayers();
  const { powerUpQueueByPlayer } = usePowerUpQueue();

  const width = 20;
  const height = 5;
  const left = 100 - width / 2;
  const top = 0;

  return (
    <>
      {players.map((player) => {
        const queuedPowerUps = powerUpQueueByPlayer[player.PLID] ?? [];

        return (
          <Fragment key={player.PLID}>
            {queuedPowerUps.length > 0 && (
              <>
                <Button
                  UCID={player.UCID}
                  top={top}
                  left={left - 4}
                  width={width + 8}
                  height={4}
                >
                  Type ^7/i powerup^9 to activate
                </Button>
                <Button
                  UCID={player.UCID}
                  left={left - 4}
                  top={top + 4}
                  width={4}
                  height={height}
                  variant="dark"
                >
                  ▶
                </Button>
                <Button
                  UCID={player.UCID}
                  left={left + width}
                  top={top + 4}
                  width={4}
                  height={height}
                  variant="dark"
                >
                  ◀
                </Button>
              </>
            )}
            <VStack
              UCID={player.UCID}
              left={left}
              top={top + 4}
              width={width}
              height={height}
              variant="dark"
            >
              {queuedPowerUps.map((powerUp) => (
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
