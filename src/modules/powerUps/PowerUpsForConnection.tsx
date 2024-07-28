import { ActivePowerUps } from "@/modules/powerUps/active/ActivePowerUps";
import { PowerUpQueue } from "@/modules/powerUps/queue/PowerUpQueue";

import { ActivePowerUpsProvider } from "./active/ActivePowerUpsContext";
import { PowerUpQueueProvider } from "./queue/PowerUpQueueContext";

export function PowerUpsForConnection() {
  return (
    <PowerUpQueueProvider>
      <ActivePowerUpsProvider>
        <PowerUpQueue />
        <ActivePowerUps />
      </ActivePowerUpsProvider>
    </PowerUpQueueProvider>
  );
}
