import { ActivePowerUpsProvider } from "./activeList/ActivePowerUpsContext";
import { PowerUpListProvider } from "./list/PowerUpListContext";
import { PowerUpsModule } from "./PowerUpsModule";
import { PowerUpQueueProvider } from "./queue/PowerUpQueueContext";

export function PowerUps() {
  return (
    <PowerUpListProvider>
      <PowerUpQueueProvider>
        <ActivePowerUpsProvider>
          <PowerUpsModule />
        </ActivePowerUpsProvider>
      </PowerUpQueueProvider>
    </PowerUpListProvider>
  );
}
