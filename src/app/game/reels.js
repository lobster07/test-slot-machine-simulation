import { Container, Texture, Sprite } from 'pixi.js';
import { backout, lerp, calcSteps } from '../../utils/common';

export const SYMBOL_WIDTH = 141;
export const SYMBOL_HEIGHT = 121;
export const ROUND_TIME = 700;
export const BACKOUT_TIME = 300;

const setOrder = (arr, i) => (
    arr.slice(i).concat(arr.slice(0, i))
);

export class Reals {
    _screen = null;
    _container = null;
    _tweening = null;
    _reels = null;
    _running = false;
    _initialized = false;

    constructor(stage, screen) {
        this._screen = screen;
        this._container = stage.addChild(new Container());
    }

    positions() {
        return this._initialized ? this._reels.map(({ position }) => position) : null;
    };

    startSpin({ positions, roundTime = ROUND_TIME }, onSpinComplete) {
        if (this._running) return;
        this._running = true;

        this._reels.forEach((reel, i) => {
            const time = roundTime + (i * roundTime);
            const steps = calcSteps(reel.position, positions[i], reel.symbols.length, i);

            const onComplete = (i === this._reels.length - 1) ? () => {
                this._running = false;
                onSpinComplete(this.positions());
            } : null;

            this._tweenTo(reel, positions[i], steps, reel.symbols.length, time, onComplete);
        });
    }

    init({ reels, position }) {
        const newReels = [];
        const newTweening = [];

        const reelsContainer = new Container();
        reelsContainer.y = 50;
        reelsContainer.x = this._screen.width/2 - (reels.length * SYMBOL_WIDTH /2);

        reels.forEach((symbols, i) => {
            const container = new Container();
            container.position.set(i * SYMBOL_WIDTH, 0);

            const reel = {
                symbols: [],
                position: 0
            };

            setOrder(symbols, position[i])
                .forEach(({ texture }, j) => {
                    const symbol = new Sprite(Texture.from(texture));
                    symbol.position.set(0, j * SYMBOL_HEIGHT);

                    reel.symbols.push(symbol);
                    container.addChild(symbol);
                });

            newReels.push(reel);
            reelsContainer.addChild(container);
        });
        
        if (this._container.children.length) {
            this._container.removeChildren();
        }
        this._container.addChild(reelsContainer);
        this._reels = newReels;
        this._tweening = newTweening;
        this._initialized = true;
    }

    _tweenTo(reel, target, steps, range, time, onComplete) {    
        this._tweening.push({
            startPosition: reel.position,
            reel,
            target,
            steps,
            range,
            time,
            onComplete,
            easing: backout(BACKOUT_TIME),
            start: Date.now(),
        });
    }

    _updateTweening() {
        const now = Date.now();
        const remove = [];

        this._tweening.forEach((tween) => {
            const phase = Math.min(1, (now - tween.start) / tween.time);
            tween.reel.position = (tween.startPosition + lerp(0, tween.steps, tween.easing(phase))) % tween.range;

            if (phase === 1) {
                if (tween.onComplete) tween.onComplete();
                remove.push(tween);
            }
        });
        
        remove.forEach((tween) => {
            this._tweening.splice(this._tweening.indexOf(tween), 1);
        });
    }

    _updatedReels() {
        this._reels.forEach(({ symbols, position })=> {
            symbols.forEach((symbol, j) => {
                symbol.y = (((position + (j+1)) % symbols.length) * SYMBOL_HEIGHT) - SYMBOL_HEIGHT;
            });
        });
    }

    update(){ 
        if (!this._initialized) return;
        this._updateTweening();
        this._updatedReels();
    }
}