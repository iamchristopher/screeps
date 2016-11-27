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
        const spawner = Game.spawns['hq'];
        const totalCreeps = Object.keys(Game.creeps).length;


        if (!tickThrottle(10)) {
            spawn.run(spawner);
        }

        Object.keys(Game.creeps)
            .forEach(id => {
                const creep = Game.creeps[id];

                switch (creep.memory.role) {
                    case 'miner':
                        return mine.run(creep);
                    case 'harvester':
                        return harvest.run(creep);
                    case 'upgrader':
                        return upgrade.run(creep);
                    case 'builder':
                        return build.run(creep);
                    case 'maintainer':
                        return maintain.run(creep);
                    default:
                        return console.log(`No role defined for ${creep.memory.role}`);
                }
            });
    }
}
