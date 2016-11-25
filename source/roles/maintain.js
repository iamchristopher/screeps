import harvest from './harvest';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_CONTROLLER,
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_WALL
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
            const sites = creep.room.find(FIND_STRUCTURES);

            if (sites) {
                const targetSite = sites
                    .sort(sortByPreference(preferredStructures))
                    .shift();

                if (creep.repair(targetSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSite);
                }
            }
        } else {
            harvest.run(creep);
        }
    }
};

function sortByPreference (preferences) {
    return (a, b) => {
        const x = preferences.indexOf(a.structureType);
        const y = preferences.indexOf(b.structureType);

        if (x > 0 && y < 0) {
            return -1;
        }

        if (x < 0 && y > 0) {
            return 1;
        }

        if (x > y) {
            return -1;
        }

        if (x < y) {
            return 1;
        }

        return 0;
    };
}
