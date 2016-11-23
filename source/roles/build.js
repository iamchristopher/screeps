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

            if (sites) {
                const targetSites = sites.sort(sortSitesByProgress);
                const inProgressSite = targetSites.find(s => s.progress > 0);
                const targetSite = inProgressSite || creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                if (creep.build(targetSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSite);
                }
            } else {
                harvest.run(creep);
            }
        } else {
            harvest.run(creep);
        }
    }
};

function sortSitesByProgress (a, b) {
    if (a.progress < b.progress) {
        return 1;
    }

    if (a.progress > b.progress) {
        return -1;
    }

    return 0;
}
