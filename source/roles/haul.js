import harvest from './harvest';
import {
    tickThrottle
} from '../utils/game';
import {
    byPreference
} from '../utils/sort';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION
];

export default {
    run (creep) {
        if (creep.memory.working && creep.carry.energy <= 0) {
            const targetSite = creep.room.find(FIND_STRUCTURES, {
                filter (o) {
                    if (o.structureType === STRUCTURE_CONTAINER) {
                        if (o.store.energy > 0) {
                            return true;
                        }
                    }

                    return false;
                }
            })
                .shift();

            creep.memory.target = targetSite.id;
            creep.memory.working = false;
        }

        if (!creep.memory.working && creep.carry.energy >= creep.carryCapacity) {
            const targetSite = creep.room.find(FIND_STRUCTURES, {
                filter: o => preferredStructures.indexOf(o.structureType) > -1
            })
                .sort(byPreference(preferredStructures))
                .shift();

            creep.memory.target = targetSite.id;
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            if (creep.memory.target) {
                const target = Game.getObjectById(creep.memory.target);
                if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                harvest.run(creep);
            }
        } else {
            if (creep.memory.target) {
                const harvestTarget = Game.getObjectById(creep.memory.target);

                if (harvestTarget && creep.withdraw(harvestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(harvestTarget);
                }
            } else {
                harvest.run(creep);
            }
        }
    }
};
