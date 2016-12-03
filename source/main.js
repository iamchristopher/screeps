import roomController from './controllers/room';

import {
    tickThrottle
} from './utils/game';

export default {
    loop () {
        for (const id in Game.rooms) {
            roomController(Game.rooms[id]);
        }

        if (tickThrottle(200)) {
            for (const id in Memory.creeps) {
                if (!Game.creeps[id]) {
                    delete Memory.creeps[id];
                }
            }
        }
    }
}
