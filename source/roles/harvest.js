const preferredStructures = [
    'extension',
    'spawn'
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
                    if (preferredStructures.indexOf(structure.structureType) > -1 && structure.energy < structure.energyCapacity) {
                        return true;
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
