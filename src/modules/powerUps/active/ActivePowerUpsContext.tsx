import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { useConnectionContext } from "@/contexts/ConnectionContext";
import { log } from "@/log";
import type { WithRequired } from "@/types";

import type { PowerUp, PowerUpId } from "../types";

type PowerUpWithTimeout = WithRequired<PowerUp, "timeout">;

type QueuedPowerUp = PowerUpWithTimeout & {
  queueId: PowerUpId;
  timeRemainingMs: number;
};

type ActivePowerUps = QueuedPowerUp[];

export type ActivePowerUpsContextType = {
  activePowerUps: ActivePowerUps;
  addPowerUp: (
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
  const [activePowerUps, setActivePowerUps] = useState<QueuedPowerUp[]>([]);
  const { connection } = useConnectionContext();

  const addPowerUp = (powerUp: PowerUpWithTimeout, onTimeout?: () => void) => {
    const queuedPowerUpId = generatePowerUpId(powerUp);

    log(`UCID ${connection.UCID} - Activating power-up ${queuedPowerUpId}`);

    const queuedPowerUp: QueuedPowerUp = {
      ...powerUp,
      queueId: queuedPowerUpId,
      timeRemainingMs: powerUp.timeout,
    };

    setActivePowerUps((prevState) => [...prevState, queuedPowerUp]);

    const timeUpdateInterval = 1000;
    const countdownInterval = setInterval(() => {
      updateTimeRemaining(queuedPowerUpId, -timeUpdateInterval);
    }, timeUpdateInterval);

    setTimeout(() => {
      removePowerUp(queuedPowerUpId);
      clearInterval(countdownInterval);
      onTimeout?.();
    }, powerUp.timeout);

    return queuedPowerUp;
  };

  const removePowerUp = (powerUpId: PowerUpId) => {
    log(`UCID ${connection.UCID} - Removing power-up ${powerUpId}`);

    setActivePowerUps((prevState) =>
      prevState.filter((queuedPowerUp) => queuedPowerUp.queueId !== powerUpId),
    );
  };

  const updateTimeRemaining = (powerUpId: PowerUpId, timeToAddMs: number) => {
    setActivePowerUps((prevState) => {
      const foundPowerUp = prevState.find(
        (queuedPowerUp) => queuedPowerUp.queueId === powerUpId,
      );

      if (!foundPowerUp) {
        return prevState;
      }

      return prevState.map((queuedPowerUp) => {
        if (queuedPowerUp.queueId === powerUpId) {
          const timeRemainingMs = queuedPowerUp.timeRemainingMs + timeToAddMs;

          log(
            `UCID ${connection.UCID} - Updating time remaining for power-up ${powerUpId} (${timeRemainingMs} ms)`,
          );
          return {
            ...queuedPowerUp,
            timeRemainingMs,
          };
        }

        return queuedPowerUp;
      });
    });
  };
  return (
    <ActivePowerUpsContext.Provider
      value={{
        activePowerUps,
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
