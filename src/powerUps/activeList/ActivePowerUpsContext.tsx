import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { log } from "../../log";
import type { PlayerId, WithRequired } from "../../types";
import type { PowerUp, PowerUpId } from "../types";

type PowerUpWithTimeout = WithRequired<PowerUp, "timeout">;

type QueuedPowerUp = PowerUpWithTimeout & {
  queueId: PowerUpId;
  timeRemainingMs: number;
};

type Queue = Record<PlayerId, QueuedPowerUp[]>;

export type ActivePowerUpsContextType = {
  activePowerUpsByPlayer: Queue;
  addPowerUp: (
    playerId: PlayerId,
    powerUp: PowerUpWithTimeout,
    onTimeout?: () => void,
  ) => QueuedPowerUp;
};

const ActivePowerUpsContext = createContext<ActivePowerUpsContextType | null>(
  null,
);

type ActivePowerUpsProviderProps = {
  children: ReactNode;
};

export function ActivePowerUpsProvider({
  children,
}: ActivePowerUpsProviderProps) {
  const [activePowerUpsByPlayer, setActivePowerUpsByPlayer] = useState<Queue>(
    {},
  );

  const addPowerUp = (
    playerId: PlayerId,
    powerUp: PowerUpWithTimeout,
    onTimeout?: () => void,
  ) => {
    const queuedPowerUpId = generatePowerUpId(powerUp);

    log(
      `Adding power-up ${queuedPowerUpId} from player ${playerId} to active list`,
    );
    log(`Current list: ${JSON.stringify(activePowerUpsByPlayer)}`);

    const queuedPowerUp: QueuedPowerUp = {
      ...powerUp,
      queueId: queuedPowerUpId,
      timeRemainingMs: powerUp.timeout,
    };

    setActivePowerUpsByPlayer((prevState) => ({
      ...prevState,
      [playerId]: [...(prevState[playerId] ?? []), queuedPowerUp],
    }));

    const timeUpdateInterval = 1000;
    const countdownInterval = setInterval(() => {
      updateTimeRemaining(playerId, queuedPowerUpId, -timeUpdateInterval);
    }, timeUpdateInterval);

    setTimeout(() => {
      removePowerUp(playerId, queuedPowerUpId);
      clearInterval(countdownInterval);
      onTimeout?.();
    }, powerUp.timeout);

    return queuedPowerUp;
  };

  const removePowerUp = (playerId: PlayerId, powerUpId: PowerUpId) => {
    log(
      `Removing power-up ${powerUpId} from active list of player ${playerId}`,
    );
    log(`Current list: ${JSON.stringify(activePowerUpsByPlayer)}`);

    setActivePowerUpsByPlayer((prevState) => ({
      ...prevState,
      [playerId]: [...(prevState[playerId] ?? [])].filter(
        (powerUp) => powerUp.queueId !== powerUpId,
      ),
    }));
  };

  const updateTimeRemaining = (
    playerId: PlayerId,
    powerUpId: PowerUpId,
    timeToAddMs: number,
  ) => {
    log(
      `Updating time remaining for power-up ${powerUpId} from active list of player ${playerId}`,
    );
    log(`Current list: ${JSON.stringify(activePowerUpsByPlayer)}`);
    setActivePowerUpsByPlayer((prevState) => {
      const foundPowerUp = prevState[playerId]?.find(
        (queuedPowerUp) => queuedPowerUp.queueId === powerUpId,
      );

      if (!foundPowerUp) {
        return prevState;
      }

      return {
        ...prevState,
        [playerId]: [
          ...(prevState[playerId] ?? []).map((queuedPowerUp) => {
            if (queuedPowerUp.queueId === powerUpId) {
              return {
                ...queuedPowerUp,
                timeRemainingMs: queuedPowerUp.timeRemainingMs + timeToAddMs,
              };
            }

            return queuedPowerUp;
          }),
        ],
      };
    });
  };
  return (
    <ActivePowerUpsContext.Provider
      value={{
        activePowerUpsByPlayer,
        addPowerUp,
      }}
    >
      {children}
    </ActivePowerUpsContext.Provider>
  );
}

export function useActivePowerUps() {
  const activePowerUpsContext = useContext(ActivePowerUpsContext);

  if (activePowerUpsContext === null) {
    throw new Error(
      "useActivePowerUps hook must be called within <ActivePowerUpsProvider>",
    );
  }

  return activePowerUpsContext;
}

function generatePowerUpId(powerUp: PowerUp): string {
  return `${powerUp.id}-${Math.random().toString(36).slice(2)}`;
}
