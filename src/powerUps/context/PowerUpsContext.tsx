import type { ReactNode } from "react";
import { createContext, useState } from "react";

import type { PlayerId } from "../../types";
import type { ManualPowerUp, PowerUp, PowerUpId } from "../types";

type QueuedPowerUp = ManualPowerUp & { queueId: PowerUpId };

type Queue = Record<PlayerId, QueuedPowerUp[]>;

export type PowerUpsContextType = {
  powerUps: PowerUp[];
  powerUpQueueByPlayer: Queue;
  addPowerUp: (playerId: PlayerId, powerUp: ManualPowerUp) => void;
  removePowerUp: (playerId: PlayerId, powerUp: QueuedPowerUp) => void;
};

export const PowerUpsContext = createContext<PowerUpsContextType | null>(null);

type PowerUpsProviderProps = {
  powerUps: PowerUp[];
  children: ReactNode;
};

export function PowerUpsProvider({
  powerUps,
  children,
}: PowerUpsProviderProps) {
  const [powerUpQueueByPlayer, setPowerUpQueueByPlayer] = useState<Queue>({});

  return (
    <PowerUpsContext.Provider
      value={{
        powerUps,
        powerUpQueueByPlayer,
        addPowerUp: (playerId, powerUp) => {
          setPowerUpQueueByPlayer((prevState) => ({
            ...prevState,
            [playerId]: [
              ...(prevState[playerId] ?? []),
              {
                ...powerUp,
                queueId: `${powerUp.id}-${Math.random().toString(36).slice(2)}`,
              },
            ],
          }));
        },
        removePowerUp: (playerId, powerUpToRemove) => {
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
    </PowerUpsContext.Provider>
  );
}
