import harvest from './harvest';

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

            const preference = [
                STRUCTURE_CONTAINER,
                STRUCTURE_EXTENSION,
                STRUCTURE_WALL
            ].reverse();

            if (sites) {
                const targetSites = sites.sort(sortSitesByProgress);
                const inProgressSite = targetSites.find(s => s.progress > 0);

                let targetSite;
                if (inProgressSite) {
                    targetSite = inProgressSite;
                } else {
                    targetSite = sites.sort(sortByPreference(preference)).reverse()[0];
                }

                if (creep.build(targetSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSite);
                }
            } else {
                harvest.run(creep);
            }
        } else {
            harvest.run(creep);
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

function sortSitesByProgress (a, b) {
    if (a.progress < b.progress) {
        return 1;
    }

    if (a.progress > b.progress) {
        return -1;
    }

    return 0;
}
