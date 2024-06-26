import { Button, HStack } from "react-node-insim";

import { usePowerUpList } from "../list/PowerUpListContext";

export function AllPowerUps() {
  const { powerUps } = usePowerUpList();

  const height = 5;
  const left = 150;
  const top = 80;

  return (
    <>
      <Button
        UCID={255}
        width={30}
        height={height}
        left={left}
        top={top}
        align="left"
        color="title"
      >
        All available power-ups
      </Button>
      <HStack
        UCID={255}
        left={left}
        top={top + height}
        height={height}
        variant="light"
      >
        <Button width={16}>ID</Button>
        <Button width={14}>Display name</Button>
        <Button width={10}>Activation</Button>
        <Button width={10}>Timeout</Button>
      </HStack>
      {powerUps.map((powerUp, index) => (
        <HStack
          key={powerUp.id}
          UCID={255}
          left={left}
          top={top + height * (2 + index)}
          height={height}
          variant="dark"
        >
          <Button width={16}>{powerUp.id}</Button>
          <Button width={14}>{powerUp.name}</Button>
          <Button width={10}>{powerUp.isInstant ? "auto" : "manual"}</Button>
          <Button width={10}>
            {powerUp.timeout !== undefined
              ? (powerUp.timeout / 1000).toFixed(0)
              : "-"}
          </Button>
        </HStack>
      ))}
    </>
  );
}
