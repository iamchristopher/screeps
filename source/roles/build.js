import harvest from './harvest';

const preferredStructures = [
    STRUCTURE_TOWER,
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER,
    STRUCTURE_WALL
];

export default {
    run (creep) {
        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
        }

        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            const sites = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (sites) {
                const targetSites = sites.sort(sortSitesByProgress);
                const inProgressSite = targetSites.find(s => s.progress > 0);

                let targetSite;
                if (inProgressSite) {
                    targetSite = inProgressSite;
                } else {
                    targetSite = sites
                        .sort(sortByPreference(preferredStructures))
                        .shift();
                }

                if (creep.build(targetSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSite);
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

function sortSitesByProgress (a, b) {
    if (a.progress < b.progress) {
        return 1;
    }

    if (a.progress > b.progress) {
        return -1;
    }

    return 0;
}
