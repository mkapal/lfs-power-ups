import { ActivePowerUps } from "./active/ActivePowerUps";
import { ActivePowerUpsProvider } from "./active/ActivePowerUpsContext";
import { PowerUpQueue } from "./queue/PowerUpQueue";
import { PowerUpQueueProvider } from "./queue/PowerUpQueueContext";

export function PowerUps() {
  return (
    <PowerUpQueueProvider>
      <ActivePowerUpsProvider>
        <PowerUpQueue />
        <ActivePowerUps />
      </ActivePowerUpsProvider>
    </PowerUpQueueProvider>
  );
}
