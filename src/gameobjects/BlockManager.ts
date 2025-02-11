import {Block} from "./Block.ts";
import {IGameScene} from "../scenes/Game.ts";
import {GameUI} from "../ui/GameUI.ts";

export class BlockManager {
    private readonly gameScene: IGameScene;
    public blocks: Block[][] = [];
    private static GRID_SIZE: number = 4;
    private static BLOCK_GAP: number;
    private static BLOCK_PADDING: number;
    private static BLOCK_WIDTH: number;
    private static BLOCK_HEIGHT: number;
    private gameUI: GameUI;
    
    constructor(gameScene: IGameScene, gameUI: GameUI, gameBgWidth: number, gameBgHeight: number) {
        this.gameScene = gameScene;
        this.gameUI = gameUI;
        BlockManager.BLOCK_GAP = 15;
        BlockManager.BLOCK_PADDING = 15;
        BlockManager.BLOCK_WIDTH = (gameBgWidth - (BlockManager.BLOCK_PADDING * 2) - (BlockManager.BLOCK_GAP * 3)) / 4;
        BlockManager.BLOCK_HEIGHT = (gameBgHeight - (BlockManager.BLOCK_PADDING * 2) - (BlockManager.BLOCK_GAP * 3)) / 4;
        this.init();
    }

    private init() {
        for (let y = 0; y < BlockManager.GRID_SIZE; y++) {
            this.blocks[y] = [];
            for (let x = 0; x < BlockManager.GRID_SIZE; x++) {
                const block = new Block(
                    this.gameScene, 
                    BlockManager.BLOCK_PADDING + (x * (BlockManager.BLOCK_WIDTH + BlockManager.BLOCK_GAP)), 
                    BlockManager.BLOCK_PADDING + (y * (BlockManager.BLOCK_HEIGHT + BlockManager.BLOCK_GAP)), 
                    BlockManager.BLOCK_WIDTH, 
                    BlockManager.BLOCK_HEIGHT, 
                );
                this.blocks[y][x] = block;
            }
        }
        
        this.generateRandomBlock(4);
    }
    
    public getBlockGraphic() {
        const graphics = [];
        
        for (let x = 0; x < BlockManager.GRID_SIZE; x++) {
            for (let y = 0; y < BlockManager.GRID_SIZE; y++) {
                graphics.push(this.blocks[x][y].graphic);
                graphics.push(this.blocks[x][y].textScore);
            }
        }
        
        return graphics;
    }
    
    public moveLeft() {
        for (let x = 0; x < BlockManager.GRID_SIZE; x++) {
            for (let y = 1; y < BlockManager.GRID_SIZE; y++) {
                let point = y;
                while (point >= 1) {
                    if (this.blocks[x][point - 1].score === 0) {
                        this.blocks[x][point - 1].updateScore(this.blocks[x][point].score);
                        this.blocks[x][point].updateScore(0);
                        point--;
                    } else if (this.blocks[x][point - 1].score === this.blocks[x][point].score) {
                        this.blocks[x][point - 1].updateScore(this.blocks[x][point].score * 2);
                        this.blocks[x][point].updateScore(0);
                        this.gameUI.updateScore(this.blocks[x][point - 1].score);
                        point--;
                    } else {
                        break;
                    }
                }
            }
        }
        this.generateRandomBlock(1);
    }

    public moveRight() {
        for (let x = 0; x < BlockManager.GRID_SIZE; x++) {
            for (let y = BlockManager.GRID_SIZE - 2; y >= 0; y--) {
                let point = y;
                while (point < BlockManager.GRID_SIZE - 1) {
                    if (this.blocks[x][point + 1].score === 0) {
                        this.blocks[x][point + 1].updateScore(this.blocks[x][point].score);
                        this.blocks[x][point].updateScore(0);
                        point++;
                    } else if (this.blocks[x][point + 1].score === this.blocks[x][point].score) {
                        this.blocks[x][point + 1].updateScore(this.blocks[x][point].score * 2);
                        this.blocks[x][point].updateScore(0);
                        this.gameUI.updateScore(this.blocks[x][point + 1].score);
                        point++;
                    } else {
                        break;
                    }
                }
            }
        }
        this.generateRandomBlock(1);
    }

    public moveUp() {
        for (let y = 0; y < BlockManager.GRID_SIZE; y++) {
            for (let x = 1; x < BlockManager.GRID_SIZE; x++) {
                let point = x;
                while (point >= 1) {
                    if (this.blocks[point - 1][y].score === 0) {
                        this.blocks[point - 1][y].updateScore(this.blocks[point][y].score);
                        this.blocks[point][y].updateScore(0);
                        point--;
                    } else if (this.blocks[point - 1][y].score === this.blocks[point][y].score) {
                        this.blocks[point - 1][y].updateScore(this.blocks[point][y].score * 2);
                        this.blocks[point][y].updateScore(0);
                        this.gameUI.updateScore(this.blocks[point - 1][y].score);
                        point--;
                    } else {
                        break;
                    }
                }
            }
        }
        this.generateRandomBlock(1);
    }

    public moveDown() {
        for (let y = 0; y < BlockManager.GRID_SIZE; y++) {
            for (let x = BlockManager.GRID_SIZE - 2; x >= 0; x--) {
                let point = x;
                while (point < BlockManager.GRID_SIZE - 1) {
                    if (this.blocks[point + 1][y].score === 0) {
                        this.blocks[point + 1][y].updateScore(this.blocks[point][y].score);
                        this.blocks[point][y].updateScore(0);
                        point++;
                    } else if (this.blocks[point + 1][y].score === this.blocks[point][y].score) {
                        this.blocks[point + 1][y].updateScore(this.blocks[point][y].score * 2);
                        this.blocks[point][y].updateScore(0);
                        this.gameUI.updateScore(this.blocks[point + 1][y].score);
                        point++;
                    } else {
                        break;
                    }
                }
            }
        }
        this.generateRandomBlock(1);
    }
    
    private generateRandomBlock(numberToGenerate: number) {
        let initBlockCount = numberToGenerate;

        while (initBlockCount > 0) {
            const x = Phaser.Math.Between(0, BlockManager.GRID_SIZE - 1);
            const y = Phaser.Math.Between(0, BlockManager.GRID_SIZE - 1);

            if (this.blocks[y][x].score === 0) {
                initBlockCount--;
                this.blocks[y][x].updateScore(2);
            }
        }
    }
}