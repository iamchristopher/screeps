export default {
    run (spawner) {
        if (spawner.spawning || !spawner.canCreateCreep()) {
            return;
        }

        const spawnName = `Spawn_${Game.time}`;

        const currentSpawns = Object.keys(Game.creeps)
            .reduce((cache, id) => {
                const creep = Game.creeps[id];

                return {
                    ...cache,
                    [creep.memory.role]: cache[creep.memory.role]
                        ?   cache[creep.memory.role] + 1
                        :   1
                };
            }, {});
// console.log(JSON.stringify(currentSpawns));
        if (!currentSpawns.harvester || currentSpawns.harvester < 2) {
            // console.log('spawn harvester', spawnName);
            spawner.createCreep([ WORK, MOVE, CARRY ], spawnName, {
                role: 'harvester'
            });
        } else if (!currentSpawns.upgrader || currentSpawns.upgrader < 1) {
            console.log('spawn upgrader', spawnName);
            spawner.createCreep([ WORK, MOVE, CARRY ], spawnName, {
                role: 'upgrader'
            });
        } else if (!currentSpawns.miner || currentSpawns.miner < 1) {
            console.log('spawn miner', spawnName);
            spawner.createCreep([ MOVE, WORK, WORK ], spawnName, {
                role: 'miner'
            });
        }
    }
}
