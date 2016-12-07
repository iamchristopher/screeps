import harvest from './harvest';
import {
    byPreference,
    byProgress
} from '../utils/sort';
import {
    tickThrottle
} from '../utils/game';

const preferredStructures = [
    STRUCTURE_TOWER,
    STRUCTURE_EXTENSION,
    STRUCTURE_STORAGE,
    STRUCTURE_CONTAINER,
    STRUCTURE_RAMPART,
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
            const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            const targetSites = sites.sort(byProgress);
            const inProgressSite = targetSites.find(s => s.progress > 0);

            if (inProgressSite) {
                creep.memory.target = inProgressSite.id;
            } else if (sites.length) {
                const targetSite = sites
                    .sort(byPreference(preferredStructures))
                    .shift();

                creep.memory.target = targetSite.id;
            } else {
                return harvest.run(creep);
            }
        }

        const target = Game.getObjectById(creep.memory.target);
        const actionResult = creep.build(target);

        switch (actionResult) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                creep.memory.target = null;
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                creep.memory.working = true;
                creep.memory.target = null;
                break;
            case OK:
                // S'all good
                break;
            default:
                console.log('No build action for result', actionResult);
        }
    },

    buildRoadIfNeeded (creep) {
        const positionHasRoad = creep.pos.lookFor(LOOK_STRUCTURES)
            .some(o => o.structureType === STRUCTURE_ROAD);

        if (!positionHasRoad && creep.memory.role !== 'builder') {
            creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }
    }
};
