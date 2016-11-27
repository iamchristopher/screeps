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
                    .sort(sortByPreference(preferredStructures))
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
            const target = creep.pos.findClosestByPath(FIND_SOURCES);

            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

function sortByPreference (preferences) {
    return (a, b) => {
        const x = preferences.indexOf(a.structureType);
        const y = preferences.indexOf(b.structureType);

        if (y < 0) {
            return -1;
        }

        if (x < 0) {
            return 1;
        }

        if (x > y) {
            return 1;
        }

        if (y > x) {
            return -1;
        }

        return 0;
    };
}
