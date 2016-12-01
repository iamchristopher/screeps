import {
    tickThrottle
} from '../utils/game';

export default (tower) => {
    const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        return tower.attack(target);
    }
}
