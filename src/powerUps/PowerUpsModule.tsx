import { useInstantPowerUps } from "./activation/useInstantPowerUps";
import { useManualPowerUps } from "./activation/useManualPowerUps";
import { ActivePowerUps, AvailablePowerUps } from "./components";

export function PowerUpsModule() {
  useManualPowerUps();
  useInstantPowerUps();

  return (
    <>
      <AvailablePowerUps />
      <ActivePowerUps />
    </>
  );
}
