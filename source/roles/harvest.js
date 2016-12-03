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
        if (!creep.memory.working && creep.carry.energy === 0) {
            creep.memory.target = null;
            creep.memory.working = true;
        }

        if (creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.target = null;
            creep.memory.working = false;
        }

        if (creep.memory.working) {
            if (!creep.memory.target) {
                const target = creep.pos.findClosestByRange(FIND_SOURCES);

                creep.memory.target = target.id;
            }

            const target = Game.getObjectById(creep.memory.target);
            const actionResult = creep.harvest(target);

            switch (actionResult) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_INVALID_TARGET:
                    console.log('Invalid harvest target', target);
                    creep.memory.target = null;
                    break;
                case OK:
                    // S'all good
                    break;
                default:
                    console.log('No harvest action for result', actionResult);
            }
        } else {
            if (!creep.memory.target) {
                const target = creep.room.find(FIND_STRUCTURES, {
                    filter (o) {
                        if (o.energy < o.energyCapacity) {
                            return true;
                        }

                        if (o.store && o.store.energy < o.storeCapacity) {
                            return true;
                        }

                        return false;
                    }
                })
                    .sort(byPreference(preferredStructures))
                    .shift();

                creep.memory.target = target.id;
            }

            const target = Game.getObjectById(creep.memory.target);
            const actionResult = creep.transfer(target, RESOURCE_ENERGY);

            switch (actionResult) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_FULL:
                case ERR_INVALID_TARGET:
                case ERR_NOT_ENOUGH_ENERGY:
                    console.log('Invalid deposit target', target);
                    creep.memory.target = null;
                    break;
                case OK:
                    // S'all good
                    break;
                default:
                    console.log('No deposit action for result', actionResult);
            }
        }
    }
};
