import harvest from './harvest';
import {
    tickThrottle
} from '../utils/game';
import {
    byPreference
} from '../utils/sort';

const preferredStructures = [
    STRUCTURE_STORAGE,
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
                const target = creep.room.find(FIND_STRUCTURES, {
                    filter (o) {
                        if (preferredStructures.indexOf(o.structureType) > -1) {
                            if (o.store.energy > 0) {
                                return true;
                            }
                        }

                        return false;
                    }
                })
                    .sort(byPreference(preferredStructures))
                    .shift();

                creep.memory.target = target.id;
            }

            const target = Game.getObjectById(creep.memory.target);
            const actionResult = creep.withdraw(target, RESOURCE_ENERGY);

            switch (actionResult) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_FULL:
                case ERR_INVALID_TARGET:
                    creep.memory.working = false;
                    creep.memory.target = null;
                    break;
                case OK:
                    // S'all good
                    break;
                default:
                    console.log('No haul action for result', actionResult);
            }
        } else {
            if (!creep.memory.target) {
                const target = creep.room.find(FIND_STRUCTURES, {
                    filter (o) {
                        if (o.structureType === STRUCTURE_EXTENSION) {
                            if (o.energy < o.energyCapacity) {
                                return true;
                            }
                        }

                        return false;
                    }
                })
                    .shift();

                if (!target) {
                    creep.memory.working = true;
                    return harvest.run(creep, {
                        gatherOnly: true
                    });
                }

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
