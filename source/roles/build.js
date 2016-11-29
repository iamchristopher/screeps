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
    STRUCTURE_CONTAINER,
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
            if (tickThrottle(10)) {
                const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                const targetSites = sites.sort(byProgress);
                const inProgressSite = targetSites.find(s => s.progress > 0);

                if (inProgressSite) {
                    creep.memory.target = inProgressSite.id;
                } else {
                    const targetSite = sites
                        .sort(byPreference(preferredStructures))
                        .shift();

                    creep.memory.target = targetSite.id;
                }
            }

            if (creep.memory.target) {
                const buildTarget = Game.getObjectById(creep.memory.target);

                if (buildTarget && creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTarget);
                }
            } else {
                harvest.run(creep);
            }
        } else {
            const targetContainer = creep.room.find(FIND_STRUCTURES)
                .filter(structure => structure.structureType === STRUCTURE_CONTAINER)
                .filter(structure => structure.store.energy > 0)
                .shift();

            switch (creep.withdraw(targetContainer, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE:
                    return creep.moveTo(targetContainer);
                default:
                    return harvest.run(creep);
            }
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
