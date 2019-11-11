import { getRandomPositions } from '../../utils/common';
import { Reals } from './reels';
import { Panel } from './panel';

export class Game {

    _reels = null;
    _panel = null;
    _config = null;

    constructor(stage, screen) {
        this._reels = new Reals(stage, screen);
        this._panel = new Panel(stage, screen, this._startSpinHandler);
    }

    _startSpinHandler = () => {
        const { reels } = this._config;
        const symbols = reels.map(r => r.length);
        const positions = this._reels.positions().map((v, i) => getRandomPositions(symbols[i]))

        this._reels.startSpin({ positions }, this._completeSpinHandler);
        this._panel.clear();
    };

    _completeSpinHandler = (positions) => {
        const { reels, combinations } = this._config;
        const checks = combinations
            .map(check => check(reels, positions))
            .flat();

        this._panel.updateScore(checks);
    };

    startSpin(positions) {
        this._reels.startSpin({ positions }, this._completeSpinHandler);
        this._panel.clear();
    }

    update(delta) {
        this._reels.update(delta);
        this._panel.update(delta)
    }

    init(config) {
        const { reels, position, user } = config;

        this._reels.init({ reels, position });
        this._panel.init({ user, startSpinHandler: this._startSpinHandler });

        this._config = config;
    }
}