import roomController from './controllers/room';

import {
    tickThrottle
} from './utils/game';

export default {
    loop () {
        for (const id in Game.rooms) {
            roomController(Game.rooms[id]);
        }
    }
}
