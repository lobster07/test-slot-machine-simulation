import { Application, Loader, Ticker } from 'pixi.js';
import { Game, TEXTURES, TEXTURES_LIST, SYMBOLS } from './app';
import { checkLines, LINES } from './utils/combinations';

const app = new Application({
  view: document.getElementById('canvas'), 
  width: 640,         
  height: 550,        
  antialias: true,    
  transparent: true,
  sharedTicker: true,
  resolution: 1,
});

const game = new Game(app.stage, app.screen); 

Ticker.shared
    .add((delta)=> {
        game.update(delta);
        app.render();
    });

Loader.shared
    .add([...TEXTURES_LIST])
    .load(() => {

        const defaultConfig = {
            user: {
                score: 1000,
            },
            combinations: [
                checkLines(SYMBOLS.BARx3, 3, [LINES.TOP], 2000, '3 CHERRY symbols on top line 2000'),
                checkLines(SYMBOLS.BARx3, 3, [LINES.CENTER], 1000, '3 CHERRY symbols on center line 1000'),
                checkLines(SYMBOLS.BARx3, 3, [LINES.BOTTOM], 4000, '3 CHERRY symbols on bottom line 4000'),

                checkLines(SYMBOLS.CHERRY, 3, [LINES.CENTER], 1000, '3 CHERRY symbols on center line 1000'),
                checkLines(SYMBOLS.CHERRY, 3, [LINES.BOTTOM], 4000, '3 CHERRY symbols on bottom line 4000'),

                checkLines(SYMBOLS.SEVEN, 3, [LINES.TOP, LINES.CENTER, LINES.BOTTOM], 150, '3 7 symbols on any line 150'),
                checkLines(SYMBOLS.BARx3, 3, [LINES.TOP, LINES.CENTER, LINES.BOTTOM], 50, '3 3xBAR symbols on any line 50'),

            ],
            reels: [
                [
                    { name: SYMBOLS.BARx3 ,texture: TEXTURES.TEXTURE_BARx3 },
                    { name: SYMBOLS.BAR, texture: TEXTURES.TEXTURE_BAR },
                    { name: SYMBOLS.BARx2, texture: TEXTURES.TEXTURE_BARx2 },
                    { name: SYMBOLS.SEVEN, texture: TEXTURES.TEXTURE_7 },
                    { name: SYMBOLS.CHERRY, texture: TEXTURES.TEXTURE_CHERRY }
                ],
                [
                    { name: SYMBOLS.BARx3 ,texture: TEXTURES.TEXTURE_BARx3 },
                    { name: SYMBOLS.BAR, texture: TEXTURES.TEXTURE_BAR },
                    { name: SYMBOLS.BARx2, texture: TEXTURES.TEXTURE_BARx2 },
                    { name: SYMBOLS.SEVEN, texture: TEXTURES.TEXTURE_7 },
                    { name: SYMBOLS.CHERRY, texture: TEXTURES.TEXTURE_CHERRY }
                ],
                [
                    { name: SYMBOLS.BARx3 ,texture: TEXTURES.TEXTURE_BARx3 },
                    { name: SYMBOLS.BAR, texture: TEXTURES.TEXTURE_BAR },
                    { name: SYMBOLS.BARx2, texture: TEXTURES.TEXTURE_BARx2 },
                    { name: SYMBOLS.SEVEN, texture: TEXTURES.TEXTURE_7 },
                    { name: SYMBOLS.CHERRY, texture: TEXTURES.TEXTURE_CHERRY }
                ],
            ],
            position: [0,0,0]
        }

        game.init(defaultConfig);

        document.querySelectorAll(".action[mask]")
            .forEach(e => e.addEventListener('click', onActionClickHandler));
    });


    const onActionClickHandler = ({ currentTarget }) => {
        const attr = currentTarget.getAttribute('mask');
        game.startSpin(JSON.parse(attr));
    };