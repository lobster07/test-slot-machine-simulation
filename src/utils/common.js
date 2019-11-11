
export const normalizeIndex = (current, add, length) => (
    (current + add) % length
)

export const getRandomPositions = (num) => (
    Math.floor(Math.random() * num)
);

export const calcSteps = (start, target, range, extraRound = 0) => (
    range - (start + 1) + (target + 1) + range * extraRound
)

export const lerp = (a1, a2, time) => (
    a1 * (1 - time) + a2 * time
);

export const backout = (backoutTime) => time => (
    --time * time * (((backoutTime/1000) + 1) * time + (backoutTime/1000)) + 1
);