export default {
    run (spawner) {
        if (spawner.spawning || !spawner.canCreateCreep()) {
            return;
        }

        const {
            room: {
                energyCapacityAvailable
            }
        } = spawner;

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

        if (!currentSpawns.harvester || currentSpawns.harvester < 7) {
            let workEthic = [ WORK, MOVE, CARRY ];
            if (energyCapacityAvailable > 300) {
                workEthic = [ WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Harvester_${Game.time}`, {
                role: 'harvester'
            });
        } else if (!currentSpawns.upgrader || currentSpawns.upgrader < 5) {
            let workEthic = [ WORK, MOVE, CARRY ];
            if (energyCapacityAvailable > 300) {
                workEthic = [ WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Upgrader_${Game.time}`, {
                role: 'upgrader'
            });
        } else if (!currentSpawns.builder || currentSpawns.builder < 4) {
            let workEthic = [ WORK, MOVE, CARRY ];
            if (energyCapacityAvailable > 300) {
                workEthic = [ WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Builder_${Game.time}`, {
                role: 'builder'
            });
        } else if (!currentSpawns.miner || currentSpawns.miner < 0) {
            let workEthic = [ WORK, MOVE, CARRY ];
            if (energyCapacityAvailable > 300) {
                workEthic = [ WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Miner_${Game.time}`, {
                role: 'miner'
            });
        }
    }
}
