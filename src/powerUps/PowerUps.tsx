import { ActivePowerUps, AvailablePowerUps } from "./components";
import { usePowerUps } from "./hooks";

export function PowerUps() {
  usePowerUps();

  return (
    <>
      <AvailablePowerUps />
      <ActivePowerUps />
    </>
  );
}
