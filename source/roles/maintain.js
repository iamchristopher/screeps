import harvest from './harvest';
import upgrade from './upgrade';
import {
    byPreference
} from '../utils/sort';
import {
    tickThrottle
} from '../utils/game';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_CONTROLLER,
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_RAMPART,
    STRUCTURE_ROAD,
    STRUCTURE_WALL
];

export default {
    run (creep) {
        if (creep.memory.working) {
            return harvest.run(creep, {
                gatherOnly: true
            });
        }

        if (!creep.memory.target) {
            const target = creep.room.find(FIND_STRUCTURES, {
                filter (o) {
                    if ([ STRUCTURE_WALL, STRUCTURE_RAMPART ].indexOf(o.structureType) > -1) {
                        if (o.hits < 50000) {
                            return true;
                        }

                        return false;
                    }

                    if (o.hits < o.hitsMax) {
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

        if (target.hits === target.hitsMax) {
            creep.memory.target = null;
            return;
        }

        const actionResult = creep.repair(target);

        switch (actionResult) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                creep.memory.working = true;
                creep.memory.target = null;
                break;
            case OK:
                // S'all good
                break;
            default:
                console.log('No maintan action for result', actionResult);
        }
    }
};
