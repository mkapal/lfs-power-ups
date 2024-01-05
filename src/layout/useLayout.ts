import { IS_AXM, type ObjectInfo, PMOAction } from "node-insim/packets";
import { useInSim } from "react-node-insim";

export function useLayout() {
  const inSim = useInSim();

  function addObject(object: ObjectInfo) {
    inSim.send(
      new IS_AXM({
        PMOAction: PMOAction.PMO_ADD_OBJECTS,
        NumO: 1,
        Info: [object],
      }),
    );
  }

  function deleteObject(object: ObjectInfo) {
    inSim.send(
      new IS_AXM({
        PMOAction: PMOAction.PMO_DEL_OBJECTS,
        NumO: 1,
        Info: [object],
      }),
    );
  }

  function spawnObjectForTime(object: ObjectInfo, timeoutMs: number) {
    addObject(object);
    setTimeout(() => {
      deleteObject(object);
    }, timeoutMs);
  }

  return {
    addObject,
    deleteObject,
    spawnObjectForTime,
  };
}
