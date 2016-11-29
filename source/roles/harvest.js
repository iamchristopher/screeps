import {
    byPreference
} from '../utils/sort';
import {
    tickThrottle
} from '../utils/game';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER
];

export default {
    run (creep) {
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
        }

        if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            if (tickThrottle(10)) {
                const target = creep.room.find(FIND_STRUCTURES)
                    .sort(byPreference(preferredStructures))
                    .filter(structure => {
                        if (structure.energy < structure.energyCapacity) {
                            return true;
                        }

                        if (structure.store && structure.store.energy < structure.storeCapacity) {
                            return true;
                        }

                        return false;
                    })
                    .shift();

                creep.memory.target = target.id;
            }

            if (creep.memory.target) {
                const harvestTarget = Game.getObjectById(creep.memory.target);

                if (harvestTarget && creep.transfer(harvestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(harvestTarget);
                }
            }
        } else {
            if (tickThrottle(10)) {
                const target = creep.pos.findClosestByRange(FIND_SOURCES);
                creep.memory.target = target.id;
            }

            const harvestTarget = Game.getObjectById(creep.memory.target);
            if (harvestTarget && creep.harvest(harvestTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(harvestTarget);
            }
        }
    }
};
