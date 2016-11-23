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

        if (!currentSpawns.harvester || currentSpawns.harvester < 0) {
            spawner.createCreep([ WORK, MOVE, CARRY ], `Harvester_${Game.time}`, {
                role: 'harvester'
            });
        } else if (!currentSpawns.upgrader || currentSpawns.upgrader < 3) {
            spawner.createCreep([ WORK, MOVE, CARRY ], `Upgrader_${Game.time}`, {
                role: 'upgrader'
            });
        } else if (!currentSpawns.miner || currentSpawns.miner < 1) {
            spawner.createCreep([ MOVE, WORK, CARRY ], `Miner_${Game.time}`, {
                role: 'miner'
            });
        } else if (!currentSpawns.builder || currentSpawns.builder < 1) {
            spawner.createCreep([ WORK, MOVE, CARRY ], `Builder_${Game.time}`, {
                role: 'builder'
            });
        }
    }
}
