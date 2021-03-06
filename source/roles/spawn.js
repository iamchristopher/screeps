export default {
    run (spawner) {
        if (spawner.spawning || !spawner.canCreateCreep()) {
            return;
        }

        const {
            room: {
                energyAvailable,
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

        if (!currentSpawns.harvester || currentSpawns.harvester < 3) {
            let workEthic = [ WORK, WORK, MOVE, CARRY ];
            if (energyCapacityAvailable >= 900) {
                workEthic = [ MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY ];
            } else if (energyCapacityAvailable >= 500) {
                workEthic = [ WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY ];
            } else if (energyCapacityAvailable >= 400) {
                workEthic = [ WORK, WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Harvester_${Game.time}`, {
                role: 'harvester'
            });
        } else if (!currentSpawns.upgrader || currentSpawns.upgrader < 3) {
            let workEthic = [ WORK, WORK, MOVE, CARRY ];
            if (energyCapacityAvailable >= 400) {
                workEthic = [ WORK, WORK, MOVE, MOVE, CARRY, CARRY ];
            }

            spawner.createCreep(workEthic, `Upgrader_${Game.time}`, {
                role: 'upgrader'
            });
        } else if (!currentSpawns.builder || currentSpawns.builder < 1) {
            let workEthic = [ WORK, WORK, MOVE, CARRY ];
            if (energyCapacityAvailable >= 500) {
                workEthic = [ WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY ];
            } else if (energyCapacityAvailable >= 400) {
                workEthic = [ WORK, WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Builder_${Game.time}`, {
                role: 'builder'
            });
        } else if (!currentSpawns.maintainer || currentSpawns.maintainer < 3) {
            let workEthic = [ WORK, WORK, MOVE, CARRY ];
            if (energyCapacityAvailable >= 600) {
                workEthic = [ WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY ];
            } else if (energyCapacityAvailable >= 500) {
                workEthic = [ WORK, WORK, WORK, WORK, MOVE, CARRY ];
            } else if (energyCapacityAvailable >= 400) {
                workEthic = [ WORK, WORK, WORK, MOVE, CARRY ];
            }

            spawner.createCreep(workEthic, `Maintainer_${Game.time}`, {
                role: 'maintainer'
            });
        } else if (!currentSpawns.hauler || currentSpawns.hauler < 1) {
            let workEthic = [ WORK, MOVE, MOVE, CARRY, CARRY ];

            spawner.createCreep(workEthic, `Hauler_${Game.time}`, {
                role: 'hauler'
            });
        }
    }
}
