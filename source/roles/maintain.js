import harvest from './harvest';

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

            const preference = [
                STRUCTURE_SPAWN,
                STRUCTURE_CONTROLLER,
                STRUCTURE_CONTAINER,
                STRUCTURE_EXTENSION,
                STRUCTURE_WALL
            ].reverse();

            if (sites) {
                const target = sites
                    .sort(sortByPreference(preference))
                    .reverse();
// console.log('?');
// target.forEach(s => console.log(JSON.stringify(s.structureType)));
// console.log('===');

                if (creep.repair(target[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
            }
        } else {
            harvest.run(creep);
        }
    }
};

function sortByPreference (preference) {
    return (a, b) => {
        const x = preference.indexOf(a.structureType);
        const y = preference.indexOf(b.structureType);

        if (x > 0 && y < 0) {
            return 1;
        }

        if (x < 0 && y > 0) {
            return -1;
        }

        if (x > y) {
            return 1;
        }

        if (x < y) {
            return -1;
        }

        return 0;
    };
}
