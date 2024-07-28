import { Button, HStack } from "react-node-insim";

import { ConnectionButton } from "@/components/ConnectionButton";
import { useConnectionContext } from "@/contexts/ConnectionContext";

import { useActivePowerUps } from "./ActivePowerUpsContext";
import { useObjectPowerUpActivation } from "./useObjectPowerUpActivation";

export function ActivePowerUps() {
  useObjectPowerUpActivation();

  const { activePowerUps } = useActivePowerUps();
  const { connection } = useConnectionContext();

  const height = 5;
  const left = 150;
  const top = 0;

  return (
    <>
      {activePowerUps.length > 0 && (
        <ConnectionButton
          width={20}
          height={height}
          left={left}
          top={top}
          align="left"
          color="title"
        >
          Active power-ups
        </ConnectionButton>
      )}
      {activePowerUps.map((powerUp, index) => (
        <HStack
          key={`${powerUp.id}-${powerUp.queueId}`}
          UCID={connection.UCID}
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
    </>
  );
}
