import {Scene} from "phaser";
import {GameUI} from "../ui/GameUI.ts";

export interface IGameScene extends Scene {
    width: number;
    height: number;
    readonly gameBgWidth: number;
    readonly gameBgHeight: number;
    readonly gameContainer: Phaser.GameObjects.Container;
    readonly gameUI: GameUI;
}

export default class GameScene extends Scene implements IGameScene {
    public gameContainer: Phaser.GameObjects.Container;
    public width: number;
    public height: number;
    public gameBgWidth: number;
    public gameBgHeight: number;
    public gameUI: GameUI;

    constructor() {
        super({key: 'GameScene'});
    }

    preload() {
        this.width = this.sys.game.config.width as number;
        this.height = this.sys.game.config.height as number;
        this.gameBgWidth = this.width / 3;
        this.gameBgHeight = this.height - 200;
    }

    create() {
        this.gameUI = new GameUI(this);

        // Tạo khung sẵn cho game
        const gameBg = this.add.rectangle(0, 0, this.gameBgWidth, this.gameBgHeight, 0xbbada0)
            .setOrigin(0);

        const BLOCK_GAP = 15; // Khoảng cách giữa các blocks
        const BLOCK_PADDING = 15; // Padding từ mép của gameBg
        const BLOCK_WIDTH = (this.gameBgWidth - (BLOCK_PADDING * 2) - (BLOCK_GAP * 3)) / 4; // Chiều rộng của mỗi block
        const BLOCK_HEIGHT = 100; // Chiều cao của mỗi block
        
        const block = Array(4)
            .fill(0)
            .map((_, index: number) => {
                const graphics = this.add.graphics();
                graphics.fillStyle(0xccc0b3, 1);
                const x = BLOCK_PADDING + (index * (BLOCK_WIDTH + BLOCK_GAP));
                graphics.fillRoundedRect(x, BLOCK_PADDING, BLOCK_WIDTH, BLOCK_HEIGHT, 6);
                return graphics;
            });
        this.gameContainer = this.add.container(this.width / 2 - this.gameBgWidth / 2 , 150, [gameBg, ...block]);
    }
}