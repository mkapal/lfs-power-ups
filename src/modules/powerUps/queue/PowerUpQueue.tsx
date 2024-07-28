import { Button, VStack } from "react-node-insim";

import { ConnectionButton } from "@/components/ConnectionButton";
import { useConnectionContext } from "@/contexts/ConnectionContext";

import { usePowerUpQueue } from "./PowerUpQueueContext";
import { useManualPowerUpActivation } from "./useManualPowerUpActivation";

export function PowerUpQueue() {
  useManualPowerUpActivation();

  const { connection } = useConnectionContext();
  const { powerUpQueue } = usePowerUpQueue();

  const width = 20;
  const height = 5;
  const left = 100 - width / 2;
  const top = 0;

  return (
    <>
      {powerUpQueue.length > 0 && (
        <>
          <ConnectionButton
            top={top}
            left={left - 4}
            width={width + 8}
            height={4}
          >
            Type ^7/i powerup^9 to activate
          </ConnectionButton>
          <ConnectionButton
            left={left - 4}
            top={top + 4}
            width={4}
            height={height}
            variant="dark"
          >
            ▶
          </ConnectionButton>
          <ConnectionButton
            left={left + width}
            top={top + 4}
            width={4}
            height={height}
            variant="dark"
          >
            ◀
          </ConnectionButton>
        </>
      )}
      <VStack
        UCID={connection.UCID}
        left={left}
        top={top + 4}
        width={width}
        height={height}
        variant="dark"
      >
        {powerUpQueue.map((powerUp) => (
          <Button key={`${powerUp.id}-${powerUp.queueId}`}>
            {powerUp.name}
          </Button>
        ))}
      </VStack>
    </>
  );
}
