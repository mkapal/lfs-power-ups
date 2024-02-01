import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { log } from "../../log";
import type { PlayerId } from "../../types";
import type { ManualPowerUp, PowerUpId } from "../types";

type QueuedPowerUp = ManualPowerUp & { queueId: PowerUpId };

type Queue = Record<PlayerId, QueuedPowerUp[]>;

export type PowerUpQueueContextType = {
  powerUpQueueByPlayer: Queue;
  addPowerUp: (playerId: PlayerId, powerUp: ManualPowerUp) => void;
  removePowerUp: (playerId: PlayerId, powerUp: QueuedPowerUp) => void;
};

const PowerUpQueueContext = createContext<PowerUpQueueContextType | null>(null);

type PowerUpsProviderProps = {
  children: ReactNode;
};

export function PowerUpQueueProvider({ children }: PowerUpsProviderProps) {
  const [powerUpQueueByPlayer, setPowerUpQueueByPlayer] = useState<Queue>({});

  return (
    <PowerUpQueueContext.Provider
      value={{
        powerUpQueueByPlayer,
        addPowerUp: (playerId, powerUp) => {
          const queuedPowerUpId = generatePowerUpId(powerUp);

          log(`Adding power-up ${queuedPowerUpId} from player ${playerId}`);
          log(`Current queue: ${JSON.stringify(powerUpQueueByPlayer)}`);

          setPowerUpQueueByPlayer((prevState) => ({
            ...prevState,
            [playerId]: [
              ...(prevState[playerId] ?? []),
              {
                ...powerUp,
                queueId: queuedPowerUpId,
              },
            ],
          }));
        },
        removePowerUp: (playerId, powerUpToRemove) => {
          log(
            `Removing power-up ${powerUpToRemove.queueId} from player ${playerId}`,
          );
          log(`Current queue: ${JSON.stringify(powerUpQueueByPlayer)}`);

          setPowerUpQueueByPlayer((prevState) => ({
            ...prevState,
            [playerId]: [...(prevState[playerId] ?? [])].filter(
              (powerUp) => powerUp.queueId !== powerUpToRemove.queueId,
            ),
          }));
        },
      }}
    >
      {children}
    </PowerUpQueueContext.Provider>
  );
}

export function usePowerUpQueue() {
  const powerUpQueueContext = useContext(PowerUpQueueContext);

  if (powerUpQueueContext === null) {
    throw new Error(
      "usePowerUpQueue hook must be called within <PowerUpQueueContext.Provider>",
    );
  }

  return powerUpQueueContext;
}

function generatePowerUpId(powerUp: ManualPowerUp): string {
  return `${powerUp.id}-${Math.random().toString(36).slice(2)}`;
}
