export function tickThrottle (ticks) {
    return Game.time % ticks === 0;
}
