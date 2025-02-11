import {Scene} from "phaser";
import {GameUI} from "../ui/GameUI.ts";
import {BlockManager} from "../gameobjects/BlockManager.ts";

export interface IGameScene extends Scene {
    width: number;
    height: number;
    readonly gameBgWidth: number;
    readonly gameBgHeight: number;
    readonly gameContainer: Phaser.GameObjects.Container;
    readonly gameUI: GameUI;
    xGameCorContainer: number;
    restartGame(): void;
}

export default class GameScene extends Scene implements IGameScene {
    public gameContainer: Phaser.GameObjects.Container;
    public width: number;
    public height: number;
    public gameBgWidth: number;
    public gameBgHeight: number;
    public gameUI: GameUI;
    private blockManager: BlockManager;
    public xGameCorContainer: number;
    public W: Phaser.Input.Keyboard.Key | undefined;
    public S: Phaser.Input.Keyboard.Key | undefined;
    public A: Phaser.Input.Keyboard.Key | undefined;
    public D: Phaser.Input.Keyboard.Key | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor() {
        super({key: 'GameScene'});
    }

    preload() {
        this.width = this.sys.game.config.width as number;
        this.height = this.sys.game.config.height as number;
        this.gameBgWidth = this.width / 3;
        this.gameBgHeight = this.height - 200;
        this.xGameCorContainer = this.width / 2 - this.gameBgWidth / 2;
        this.W = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.S = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.A = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    create() {
        this.gameUI = new GameUI(this);
        this.blockManager = new BlockManager(this, this.gameUI, this.gameBgWidth, this.gameBgHeight);
        this.createGameUI();
    }
    
    private createGameUI() {
        const gameBg = this.add.rectangle(0, 0, this.gameBgWidth, this.gameBgHeight, 0xbbada0)
            .setOrigin(0);
        this.gameContainer = this.add.container(this.xGameCorContainer, 150, [gameBg, ...this.blockManager.getBlockGraphic()]);
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.W!) || Phaser.Input.Keyboard.JustDown(this.cursors!.up)) {
            this.blockManager.moveUp();
        } else if (Phaser.Input.Keyboard.JustDown(this.S!) || Phaser.Input.Keyboard.JustDown(this.cursors!.down)) {
            this.blockManager.moveDown();
        } else if (Phaser.Input.Keyboard.JustDown(this.A!) || Phaser.Input.Keyboard.JustDown(this.cursors!.left)) {
            this.blockManager.moveLeft();
        } else if (Phaser.Input.Keyboard.JustDown(this.D!) || Phaser.Input.Keyboard.JustDown(this.cursors!.right)) {
            this.blockManager.moveRight();
        }
    }
    
    public restartGame() {
        this.scene.restart();
    }
}