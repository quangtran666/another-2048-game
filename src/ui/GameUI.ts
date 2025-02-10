import {IGameScene} from "../scenes/Game.ts";

export class GameUI {
    private scene: IGameScene;
    private scoreTextContainer: Phaser.GameObjects.Container;
    private bestScoreTextContainer: Phaser.GameObjects.Container;
    private newGameButtonContainer: Phaser.GameObjects.Container;

    private static readonly BUTTON_BG_WIDTH = 100;
    private static readonly BUTTON_BG_HEIGHT = 40;
    private static readonly SCORE_BG_WIDTH = 100;
    private static readonly SCORE_BG_HEIGHT = 40;

    constructor(scene: IGameScene) {
        this.scene = scene;
        this.create();
    }

    create() {
        this.createNewGameButton();
        this.createScoreContainer();
        this.createBestScoreContainer();
    }

    private createNewGameButton() {
        const buttonBg = this.scene.add.rectangle(0, 0, GameUI.BUTTON_BG_WIDTH, GameUI.BUTTON_BG_HEIGHT, 0x8f7a66)
            .setInteractive()
            .setOrigin(0)
            .setStrokeStyle(0);
        const buttonText = this.scene.add.bitmapText(
            GameUI.BUTTON_BG_WIDTH / 2, 
            GameUI.BUTTON_BG_HEIGHT / 2, 
            'wendy',
            'New Game',
            16
            ).setOrigin(0.5, 0.5);
        const additionalText = this.scene.add.bitmapText(
            GameUI.BUTTON_BG_WIDTH + 10, 
            GameUI.BUTTON_BG_HEIGHT / 2,
            'wendy',
            'Join the numbers and get to the 2048 tile!', 
            13
            )
            .setOrigin(0, 0.5)
            .setTint(0x776e65);

        this.newGameButtonContainer = this.scene.add.container(
            this.scene.width / 2 - this.scene.gameBgWidth / 2,
            80,
            [buttonBg, buttonText, additionalText]
        );
        
        this.newGameButtonContainer.on('pointerdown', () => {});
    }

    private createScoreContainer() {
        const scoreBg = this.scene.add.rectangle(0, 0, GameUI.SCORE_BG_WIDTH, GameUI.SCORE_BG_HEIGHT, 0xbbada0)
            .setOrigin(0);
        const scoreText = this.scene.add.bitmapText(
            GameUI.SCORE_BG_WIDTH / 2, 
            6, 
            'wendy',
            'SCORE',
            13
            )
            .setOrigin(0.5, 0);
        const scorePoint = this.scene.add.bitmapText(
            GameUI.SCORE_BG_WIDTH / 2,
            22,
            'wendy',
            '0',
            12
            )
            .setOrigin(0.5, 0);

        this.scoreTextContainer = this.scene.add.container(
            this.scene.width / 2 + this.scene.gameBgWidth / 2 - GameUI.SCORE_BG_WIDTH,
            30,
            [scoreBg, scoreText, scorePoint]
        );
    }

    private createBestScoreContainer() {
        const bestBg = this.scene.add.rectangle(0, 0, GameUI.SCORE_BG_WIDTH, GameUI.SCORE_BG_HEIGHT, 0xbbada0)
            .setOrigin(0);
        const bestScoreText = this.scene.add.bitmapText(
            GameUI.SCORE_BG_WIDTH / 2,
            6,
            'wendy',
            'BEST',
            13
            )
            .setOrigin(0.5, 0);
        const bestScorePointText = this.scene.add.bitmapText(
            GameUI.SCORE_BG_WIDTH / 2,
            22,
            'wendy',
            '1300',
            12
            )
            .setOrigin(0.5, 0);

        this.bestScoreTextContainer = this.scene.add.container(
            this.scene.width / 2 + this.scene.gameBgWidth / 2 - GameUI.SCORE_BG_WIDTH * 2 - 20,
            30,
            [bestBg, bestScoreText, bestScorePointText]
        );
    }

    updateScore(score: number) {
        const scorePoint = this.scoreTextContainer.list[2] as Phaser.GameObjects.Text;
        scorePoint.setText(score.toString());
    }

    updateBestScore(score: number) {
        const bestScorePoint = this.bestScoreTextContainer.list[2] as Phaser.GameObjects.Text;
        bestScorePoint.setText(score.toString());
    }
}