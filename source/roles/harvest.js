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
            const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter (structure) {
                    if (preferredStructures.indexOf(structure.structureType) > -1) {

                        if (structure.energy < structure.energyCapacity) {
                            return true;
                        }

                        if (structure.store && structure.store.energy < structure.storeCapacity) {
                            return true;
                        }

                        return false;
                    }

                    return false;
                }
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            const target = creep.pos.findClosestByPath(FIND_SOURCES);

            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}
