import * as mine from './roles/mine';

export default {
    loop () {
        for (let i in Game.creeps) {
            const creep = Game.creeps[i];

            if (creep.carry.mineralAmount < creep.carryCapacity) {
                continue;
            }

            const target = creep.room
                .find(FIND_SOURCES)[0];

            mine.collectResource({
                creep,
                target
            });
        }
    }
}
