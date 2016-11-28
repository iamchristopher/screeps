import {
    byPreference
} from '../utils/sort';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER
];

export default {
    run (creep) {
        if (creep.memory.harvesting && creep.carry.energy === 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting) {
            const sites = creep.room.find(FIND_STRUCTURES);

            if (sites) {
                const targetSite = sites
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

                if (targetSite) {
                    if (creep.transfer(targetSite, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetSite);
                    }
                }
            }
        } else {
            const target = creep.pos.findClosestByRange(FIND_SOURCES);

            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};
