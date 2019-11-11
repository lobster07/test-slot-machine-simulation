import { normalizeIndex } from './common';

export const LINES = {
    TOP: 0,
    CENTER: 1,
    BOTTOM: 2,
}

export const checkLines = (type, elementsInLine, lines, value, description) => (reels, positions) => {
    const mathes = [];
    const searchMask = Array(elementsInLine).fill(1).join(',');

    for (const line of lines) {
        const symbols = reels
            .map((reel, i) => reel[(reel.length - ((positions[i] - line) % reel.length)) % reel.length])
            .map(symbol => symbol.name === type ? 1 : 0)
            .join(',');

        if (searchMask.match(symbols)) {
            mathes.push({ type, line, elementsInLine, value, description });
        }   
    }

    return mathes;
}