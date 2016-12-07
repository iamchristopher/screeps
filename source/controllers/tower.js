import {
    tickThrottle
} from '../utils/game';
import {
    byPreference
} from '../utils/sort';

const preferredStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_CONTROLLER,
    STRUCTURE_CONTAINER,
    STRUCTURE_EXTENSION,
    STRUCTURE_RAMPART,
    STRUCTURE_ROAD,
    STRUCTURE_WALL
];

export default (tower) => {
    if (tower.energy === 0) {
        return;
    }

    const attackTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (attackTarget) {
        return tower.attack(attackTarget);
    }

    if (tower.energy <= 500 || !tickThrottle(5)) {
        return;
    }

    const repairTarget = tower.room.find(FIND_STRUCTURES, {
        filter (o) {
            if ([ STRUCTURE_WALL, STRUCTURE_RAMPART ].indexOf(o.structureType) > -1) {
                if (o.hits < 50000) {
                    return true;
                }

                return false;
            }

            if (o.hits < o.hitsMax) {
                return true;
            }

            return false;
        }
    })
        .sort(byPreference(preferredStructures))
        .shift();

    tower.repair(repairTarget);
}
