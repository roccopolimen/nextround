/**
 * Generates a random color and returns it as a string value
 * @returns {string}
 */
function randomColor(): string {
    let h: number = Math.floor(Math.random() * (360 - 42 + 1)) + 42;
    let s: number = Math.floor(Math.random() * (98 - 42 + 1)) + 42;
    let l: number = Math.floor(Math.random() * (90 - 40 + 1)) + 40;
    return `hsl(${h},${s}%,${l}%)`;
}

export { randomColor }
