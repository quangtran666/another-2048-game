import {IGameScene} from "../scenes/Game.ts";

export class GameUI {
    private score: number = 0;
    private bestScore: number = 0;
    private scene: IGameScene;
    private scoreTextContainer: Phaser.GameObjects.Container;
    private bestScoreTextContainer: Phaser.GameObjects.Container;
    // @ts-ignore
    private newGameButtonContainer: Phaser.GameObjects.Container;
    private scorePointText: Phaser.GameObjects.BitmapText;
    private bestScorePointText: Phaser.GameObjects.BitmapText;

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
        
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x9f8a76);
            this.scene.game.canvas.style.cursor = 'pointer';
        })
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x8f7a66);
            this.scene.game.canvas.style.cursor = 'default';
        })
        buttonBg.on('pointerdown', () => {
            buttonBg.setFillStyle(0x7f6a56);
        })
        buttonBg.on('pointerup', () => {
            buttonBg.setFillStyle(0x8f7a66);
            this.scene.restartGame();
        })
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
        this.scorePointText = this.scene.add.bitmapText(
            GameUI.SCORE_BG_WIDTH / 2,
            22,
            'wendy',
            this.score.toString(),
            12
            )
            .setOrigin(0.5, 0);

        this.scoreTextContainer = this.scene.add.container(
            this.scene.width / 2 + this.scene.gameBgWidth / 2 - GameUI.SCORE_BG_WIDTH,
            30,
            [scoreBg, scoreText, this.scorePointText]
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
        this.bestScorePointText = this.scene.add.bitmapText(
            GameUI.SCORE_BG_WIDTH / 2,
            22,
            'wendy',
            this.bestScore.toString(),
            12
            )
            .setOrigin(0.5, 0);

        this.bestScoreTextContainer = this.scene.add.container(
            this.scene.width / 2 + this.scene.gameBgWidth / 2 - GameUI.SCORE_BG_WIDTH * 2 - 20,
            30,
            [bestBg, bestScoreText, this.bestScorePointText]
        );
    }

    public updateScore(score: number) {
        const textPoint = this.scene.add
            .bitmapText(GameUI.SCORE_BG_WIDTH / 2, 22, 'wendy', `+${score}`, 12)
            .setOrigin(0.5)
            .setTint(0x776e65);
        this.scoreTextContainer.add(textPoint);
        this.scene.tweens.add({
            targets: textPoint,
            y: { from: 22 + 20, to: 22 },
            alpha: { from: 1, to: 0 },
            duration: 800,
            onComplete: () => {
                textPoint.destroy();
            }
        })
        this.score += score;
        this.scorePointText.setText(this.score.toString());
        this.updateBestScore(this.score);
    }

    public updateBestScore(score: number) {
        this.bestScore = Math.max(this.bestScore, score);
        if (this.bestScore !== score) return;

        const textPoint = this.scene.add
            .bitmapText(GameUI.SCORE_BG_WIDTH / 2, 22, 'wendy', `${this.bestScore}`, 12)
            .setOrigin(0.5)
            .setTint(0x776e65);
        this.bestScoreTextContainer.add(textPoint);
        this.scene.tweens.add({
            targets: textPoint,
            y: { from: 22 + 20, to: 22 },
            alpha: { from: 1, to: 0 },
            duration: 800,
            onComplete: () => {
                textPoint.destroy();
            }
        })
        this.bestScorePointText.setText(this.bestScore.toString());
    }
}