import {
    mine
} from './roles/mine';

export default {
    loop () {
        for (let i in Game.creeps) {
            const creep = Game.creeps[i];

            if (creep.carryCapacity > CARRY_CAPACITY) {
                continue;
            }
mine()
            const mineral = Game.rooms['W28N66']
                .find(FIND_MINERALS)[0];
            creep.moveTo(mineral);

            // const minerals = room.find(FIND_MINERALS);
            // console.log(minerals);
        }
    }
}
