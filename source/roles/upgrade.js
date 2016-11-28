import build from './build';
import harvest from './harvest';
import {
    tickThrottle
} from '../utils/game';

let harvestTarget = null;

export default {
    run (creep) {
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
        }

        if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }

        // build.buildRoadIfNeeded(creep);

        if (creep.memory.working) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if (tickThrottle(125)) {
                harvestTarget = creep.pos.findClosestByRange(FIND_SOURCES);
            }

            if (harvestTarget && creep.harvest(harvestTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(harvestTarget);
            }
        }
    }
};
