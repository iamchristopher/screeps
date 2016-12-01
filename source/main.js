import spawn from './roles/spawn';
import mine from './roles/mine';
import harvest from './roles/harvest';
import upgrade from './roles/upgrade';
import build from './roles/build';
import maintain from './roles/maintain';

import {
    tickThrottle
} from './utils/game';

export default {
    loop () {
        for (const id in Game.spawns) {
            if (!tickThrottle(25)) {
                continue;
            }

            spawn.run(Game.spawns[id]);
        }

        for (const id in Game.creeps) {
            const creep = Game.creeps[id];

            switch (creep.memory.role) {
                case 'miner':
                    mine.run(creep);
                    break;
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
                default:
                    console.log(`No role defined for ${creep.memory.role}`);
            }
        }
    }
}
