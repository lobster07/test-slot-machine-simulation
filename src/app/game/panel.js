import { Graphics, TextStyle, Text } from 'pixi.js';

export class Panel {

    _screen = null;
    _stage = null;
    _user = null;

    _scoreText = null;
    _winValueText = null;
    _winLabelText = null;
    _tableText = null;

    _initialized = false;
    
    _style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 28,
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'],
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    _tableStyle = new TextStyle({
        fontSize: 14,
        fill: ['#ffffff'],
        stroke: '#4a1850',
        strokeThickness: 1,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    })

    constructor(stage, screen) {
        this._screen = screen;
        this._stage = stage;
    }

    init({ user, startSpinHandler }) {
        const margin = 50;
        const top = new Graphics();
        top.beginFill(0, 1);
        top.drawRect(0, 0, this._screen.width, 50);

        const bottom = new Graphics();
        bottom.beginFill(0, 1);
        bottom.drawRect(0, this._screen.height - 140, this._screen.width, this._screen.height);

        const playText = new Text('PLAY!', this._style);
        playText.x = bottom.width - playText.width - 20;
        playText.y = this._screen.height - 120 + Math.round((margin - playText.height) / 2);
        playText.interactive = true;
        playText.buttonMode = true;
        playText.addListener('pointerdown', startSpinHandler);

        const headerText = new Text('Slot machine simulation!', this._style);
        headerText.x = Math.round((top.width - headerText.width) / 2);
        headerText.y = Math.round((margin - headerText.height) / 2);

        this._winLabelText = new Text('Win!', this._style);
        this._winLabelText.x = 350;
        this._winLabelText.y = this._screen.height - 80 + Math.round((margin - this._winLabelText.height) / 2);
        this._winLabelText.visible = false;

        this._winValueText = new Text('', this._style);
        this._winValueText.x = 400;
        this._winValueText.y = this._screen.height - 80 + Math.round((margin - this._winValueText.height) / 2);
        this._winValueText.visible = false;

        this._scoreText = new Text('Score:', this._style);
        this._scoreText.x = 520;
        this._scoreText.y = this._screen.height - 80 + Math.round((margin - this._scoreText.height) / 2);
        this._scoreText.text = `Score: ${user.score}`;

        this._tableText = new Text('Pay-table:', this._tableStyle);
        this._tableText.x = 0;
        this._tableText.y = this._screen.height - 145;
        this._tableText.text = `
            Pay-table:
            4000 - 3 CHERRY symbols on bottom line;
            2000 - 3 CHERRY symbols on top line;
            1000 - 3 CHERRY symbols on center line;
            150  - 3 '7' symbols on any line
            50   - 3 3xBAR symbols on any line
            20   - 3 2xBAR symbols on any line
        `;
        top.addChild(headerText);
        bottom.addChild(playText);
        bottom.addChild(this._scoreText);
        bottom.addChild(this._winValueText);
        bottom.addChild(this._winLabelText);
        bottom.addChild(this._tableText);

        this._stage.addChild(top);
        this._stage.addChild(bottom);

        this._user = user;
        this._initialized = true;
    }

    update() {
        if (!this._initialized) return;
        this._scoreText.text = `$${this._user.score}`;
    }

    updateScore(results) {
        if (results.length) {
            const value = results.reduce((sum, { value }) => sum + value, 0);
            this._winValueText.text = `+ ${value}`;
            this._winLabelText.visible = true;
            this._winValueText.visible = true;

            this._user.score += value;
        }
    }

    clear() {
        this._winLabelText.visible = false;
        this._winValueText.visible = false;
    }
}