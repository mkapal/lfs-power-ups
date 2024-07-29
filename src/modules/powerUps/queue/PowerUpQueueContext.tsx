import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { useConnectionContext } from "@/contexts/ConnectionContext";

import type { ManualPowerUp, PowerUpId } from "../types";

type QueuedPowerUp = ManualPowerUp & { queueId: PowerUpId };

export type Queue = QueuedPowerUp[];

export type PowerUpQueueContextType = {
  powerUpQueue: Queue;
  addPowerUpToQueue: (powerUp: ManualPowerUp) => void;
  removePowerUpFromQueue: (powerUp: QueuedPowerUp) => void;
};

const PowerUpQueueContext = createContext<PowerUpQueueContextType | null>(null);

type PowerUpsProviderProps = {
  children: ReactNode;
};

export function PowerUpQueueProvider({ children }: PowerUpsProviderProps) {
  const [powerUpQueue, setPowerUpQueue] = useState<Queue>([]);
  const { log } = useConnectionContext();

  return (
    <PowerUpQueueContext.Provider
      value={{
        powerUpQueue,
        addPowerUpToQueue: (powerUp) => {
          const queuedPowerUpId = generatePowerUpId(powerUp);

          log(`Adding power-up to queue: ${queuedPowerUpId}`);

          setPowerUpQueue((prevState) => [
            ...prevState,
            { ...powerUp, queueId: queuedPowerUpId },
          ]);
        },
        removePowerUpFromQueue: (powerUpToRemove) => {
          log(`Removing power-up ${powerUpToRemove.queueId}`);

          setPowerUpQueue((prevState) =>
            prevState.filter(
              (powerUp) => powerUp.queueId !== powerUpToRemove.queueId,
            ),
          );
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
      "usePowerUpQueue hook must be called within <PowerUpQueueProvider>",
    );
  }

  return powerUpQueueContext;
}

function generatePowerUpId(powerUp: ManualPowerUp): string {
  return `${powerUp.id}-${Math.random().toString(36).slice(2)}`;
}
