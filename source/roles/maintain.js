import harvest from './harvest';
import {
    byPreference
} from '../utils/sort';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_CONTROLLER,
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_RAMPART,
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
                    .sort(byPreference(preferredStructures))
                    .filter(structure => {
                        if ([ STRUCTURE_WALL, STRUCTURE_RAMPART ].indexOf(structure.structureType) > -1) {
                            if (structure.hits < 50000) {
                                return true;
                            }

                            return false;
                        }

                        if (structure.hits < structure.hitsMax) {
                            return true;
                        }

                        return false;
                    })
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
