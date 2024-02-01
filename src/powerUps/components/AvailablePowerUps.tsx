import { Button, VStack } from "react-node-insim";

import { usePowerUpList } from "../list/PowerUpListContext";

export function AvailablePowerUps() {
  const { powerUps } = usePowerUpList();

  return (
    <>
      <Button
        UCID={255}
        width={20}
        height={5}
        left={50}
        top={15}
        variant="light"
      >
        Available power-ups
      </Button>
      <VStack
        left={50}
        top={20}
        width={20}
        height={5}
        UCID={255}
        variant="dark"
      >
        {Object.values(powerUps).map((powerUp) => (
          <Button key={powerUp.name}>{powerUp.name}</Button>
        ))}
      </VStack>
    </>
  );
}
