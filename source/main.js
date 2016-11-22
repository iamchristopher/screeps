import * as harvest from './roles/harvest';

export default {
    loop () {
        Object.keys(Game.creeps)
            .forEach(current => {
                const creep = Game.creeps[current];

                if (creep.carry.mineralAmount < creep.carryCapacity) {
                    return;
                }

                const target = creep.room
                    .find(FIND_SOURCES)[0];

                harvest.collectResource({
                    creep,
                    target
                });
            });
    }
}
