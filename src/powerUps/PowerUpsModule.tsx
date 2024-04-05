import { useManualPowerUps } from "./activation/useManualPowerUps";
import { usePowerUpTrigger } from "./activation/usePowerUpTrigger";
import { ActivePowerUps } from "./components/ActivePowerUps";
import { AllPowerUps } from "./components/AllPowerUps";
import { PowerUpQueue } from "./components/PowerUpQueue";

export function PowerUpsModule() {
  useManualPowerUps();
  usePowerUpTrigger();

  return (
    <>
      <AllPowerUps />
      <PowerUpQueue />
      <ActivePowerUps />
    </>
  );
}
