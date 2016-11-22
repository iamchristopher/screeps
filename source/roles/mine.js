export default {
    run (creep) {
        const target = creep.pos.findClosestByPath(FIND_MINERALS);

        if (!target) {
            return;
        }

        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}
