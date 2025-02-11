import {IGameScene} from "../scenes/Game.ts";

export class Block {
    private static readonly COLORS: { [key: number]: number } = {
        0: 0xCDC1B4,    
        2: 0xeee4da,
        4: 0xede0c8,
        8: 0xf2b179,
        16: 0xf59563,
        32: 0xf67c5f,
        64: 0xf65e3b,
        128: 0xedcf72,
        256: 0xedcc61,
        512: 0xedc850,
        1024: 0xedc53f,
        2048: 0xedc22e
    };
    
    private _score: number = 0;
    get score(): number {
        return this._score;
    }
    
    public graphic: Phaser.GameObjects.Graphics;
    public textScore: Phaser.GameObjects.BitmapText;
    private gameScene: IGameScene;
    
    private _x: number;
    private _y: number;
    get y(): number {
        return this._y;
    }
    get x(): number {
        return this._x;
    }
    
    private blockWidth: number;
    private blockHeight: number;
    
    constructor(gameScene: IGameScene, x: number, y: number, blockWidth: number, blockHeight: number) {
        this.gameScene = gameScene;
        this._x = x;
        this._y = y;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.createGraphic();
        this.createTextScore();
    }

    private createGraphic() {
        this.graphic = this.gameScene.add.graphics();
        this.graphic.fillStyle(Block.COLORS[this.score]);
        this.graphic.fillRoundedRect(this._x, this._y, this.blockWidth, this.blockHeight, 10);
    }

    public createTextScore() {
        this.textScore = this.gameScene.add.bitmapText(
            this._x + this.blockWidth / 2,
            this._y + this.blockHeight / 2,
            'wendy',
            this._score.toString(),
            32
        )
            .setTint(0xffffff)
            .setOrigin(0.5);
        
        if (this._score === 0) {
            this.textScore.setText('');
        }
    }
    
    public updateScore(score: number) {
        this._score = score;
        if (this._score === 0) {
            this.textScore.setText('');
        } else {
            this.textScore.setText(this._score.toString());
        }
        
        this.updateGraphic();
    }
    
    private updateGraphic() {
        const color = Block.COLORS[this._score] || Block.COLORS[2048];
        this.graphic.clear();
        this.graphic.fillStyle(color);
        this.graphic.fillRoundedRect(this._x, this._y, this.blockWidth, this.blockHeight, 10);
    }
}