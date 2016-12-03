import build from './build';
import harvest from './harvest';
import {
    tickThrottle
} from '../utils/game';

export default {
    run (creep) {
        // build.buildRoadIfNeeded(creep);

        if (creep.memory.working) {
            return harvest.run(creep);
        }

        const actionResult = creep.upgradeController(creep.room.controller);

        switch (actionResult) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.room.controller);
                break;
            case OK:
                // S'all goo
                break;
            default:
                console.log('No upgrade action for result', actionResult);
        }
    }
};
