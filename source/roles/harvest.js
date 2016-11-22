export const collectResource = ({
    creep,
    target
} = {}) => {
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        return creep.moveTo(target);
    }

    if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns['Spawn1']);
    }
}
