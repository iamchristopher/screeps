import spawn from '../roles/spawn';
import harvest from '../roles/harvest';
import upgrade from '../roles/upgrade';
import build from '../roles/build';
import maintain from '../roles/maintain';
import haul from '../roles/haul';

import towerController from './tower';

import {
    tickThrottle
} from '../utils/game';

export default (room) => {
    const spawns = room.find(FIND_MY_SPAWNS);
    for (const s of spawns) {
        if (!tickThrottle(25)) {
            continue;
        }

        spawn.run(s);
    }

    const creeps = room.find(FIND_MY_CREEPS);
    for (const creep of creeps) {
        switch (creep.memory.role) {
            case 'harvester':
                harvest.run(creep);
                break;
            case 'upgrader':
                upgrade.run(creep);
                break;
            case 'builder':
                build.run(creep);
                break;
            case 'maintainer':
                maintain.run(creep);
                break;
            case 'hauler':
                haul.run(creep);
                break;
            default:
                console.log(`No role defined for ${creep.memory.role}`);
        }
    }

    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: o => o.structureType === STRUCTURE_TOWER
    });
    for (const tower of towers) {
        towerController(tower);
    }
}
