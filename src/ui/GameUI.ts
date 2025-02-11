import {User} from "firebase/auth";
import {IGameScene} from "../scenes/Game.ts";
import {getBestScore, getCurrentUser, saveBestScore, signInWithGoogle, signOutUser, subscribeToTopScores, TopScore} from "../services/Firebase.ts"

export class GameUI {
    private score: number = 0;
    private bestScore: number = 0;
    private scene: IGameScene;
    private scoreTextContainer: Phaser.GameObjects.Container;
    private bestScoreTextContainer: Phaser.GameObjects.Container;
    private signInContainer: Phaser.GameObjects.Container;
    private userProfileContainer: Phaser.GameObjects.Container;
    private signOutContainer: Phaser.GameObjects.Container;
    private topScoreContainer: Phaser.GameObjects.Container;
    // @ts-ignore
    private newGameButtonContainer: Phaser.GameObjects.Container;
    private scorePointText: Phaser.GameObjects.BitmapText;
    private bestScorePointText: Phaser.GameObjects.BitmapText;
    private currentUser: User | null = null;

    private static readonly BUTTON_BG_WIDTH = 100;
    private static readonly BUTTON_BG_HEIGHT = 40;
    private static readonly SCORE_BG_WIDTH = 100;
    private static readonly SCORE_BG_HEIGHT = 40;

    private static readonly TOP_SCORES_COLORS = [
        0xFFD700, // Gold
    0xC0C0C0, // Silver
    0xCD7F32, // Bronze
    0x9370DB, // Purple
    0x20B2AA, // Light Sea Green
    0x4682B4, // Steel Blue
    0xDA70D6, // Orchid
    0x32CD32, // Lime Green
    0xFF69B4, // Hot Pink
    0x4169E1  // Royal Blue
    ]
    topScoresUnsubscribe: (() => void) | null = null;

    constructor(scene: IGameScene) {
        this.scene = scene;
        this.create();
    }

    create() {
        this.createNewGameButton();
        this.createScoreContainer();
        this.createBestScoreContainer();
        this.checkAuthState();
        this.createTopScoreContainer();
    }

    private async checkAuthState() {
        const user = await getCurrentUser();
        this.currentUser = user;
        if (user) {
            const savedBestScore = await getBestScore(user.uid);
            this.bestScore = savedBestScore;
            this.bestScorePointText?.setText(this.bestScore.toString());
            this.createUserProfileContainer(user);
        } else {
            this.createSignInContainer();
        }
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

    public async updateBestScore(score: number) {
        const oldBestScore = this.bestScore;
        this.bestScore = Math.max(this.bestScore, score);
        
        if (this.bestScore !== oldBestScore) {
            // Chỉ lưu khi có best score mới
            if (this.currentUser) {
                await saveBestScore(this.currentUser.uid, this.currentUser.displayName!, this.bestScore);
            }

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
            });
            this.bestScorePointText.setText(this.bestScore.toString());
        }
    }

    private createSignInContainer() {
        const signInBg = this.scene.add.rectangle(0, 0, GameUI.BUTTON_BG_WIDTH, GameUI.BUTTON_BG_HEIGHT, 0x8f7a66)
            .setInteractive()
            .setOrigin(0)
            .setStrokeStyle(0);
        const buttonText = this.scene.add.bitmapText(
            GameUI.BUTTON_BG_WIDTH / 2,
            GameUI.BUTTON_BG_HEIGHT / 2,
            'wendy',
            'Sign In',
            16
        ).setOrigin(0.5, 0.5);

        this.signInContainer = this.scene.add.container(
            this.scene.width / 2 - this.scene.gameBgWidth / 2,
            30,
            [signInBg, buttonText]
        );

        signInBg.on('pointerover', () => {
            signInBg.setFillStyle(0x9f8a76);
            this.scene.game.canvas.style.cursor = 'pointer';
        })
        signInBg.on('pointerout', () => {
            signInBg.setFillStyle(0x8f7a66);
            this.scene.game.canvas.style.cursor = 'default';
        })
        signInBg.on('pointerdown', () => {
            signInBg.setFillStyle(0x7f6a56);
        })
        signInBg.on('pointerup', async () => {
            signInBg.setFillStyle(0x8f7a66);
            try {
                const user = await signInWithGoogle();
                if (user) {
                    this.createUserProfileContainer(user);
                }
            } catch (error) {
                console.error("Failed to sign in:", error);
            }
        })
    }

    private async createUserProfileContainer(user: User) {
        if (this.signInContainer)
            this.signInContainer.destroy();

        const savedBestScore = await getBestScore(user.uid);
        this.bestScore = savedBestScore;
        this.bestScorePointText?.setText(this.bestScore.toString());
        this.currentUser = user;

        const containerWidth = GameUI.BUTTON_BG_WIDTH;
        const containerBg = this.scene.add.rectangle(0, 0, containerWidth, GameUI.BUTTON_BG_HEIGHT, 0x8f7a66)
            .setOrigin(0)
            .setStrokeStyle(0);

        const displayName = user.displayName?.split(' ')[0] || 'User'; // Lấy first name hoặc mặc định
        const nameText = this.scene.add.bitmapText(
            25,
            GameUI.BUTTON_BG_HEIGHT / 2,
            'wendy',
            displayName,
            16
        ).setOrigin(0, 0.5);

        this.userProfileContainer = this.scene.add.container(
            this.scene.width / 2 - this.scene.gameBgWidth / 2,
            30,
            [containerBg, nameText]
        ); 

        const signOutWidth = GameUI.BUTTON_BG_WIDTH;
        const signOutBg = this.scene.add.rectangle(0, 0, signOutWidth, GameUI.BUTTON_BG_HEIGHT, 0x8f7a66)
            .setInteractive()
            .setOrigin(0)
            .setStrokeStyle(0);

        const signOutText = this.scene.add.bitmapText(
            GameUI.BUTTON_BG_WIDTH / 2,
            GameUI.BUTTON_BG_HEIGHT / 2,
            'wendy',
            'Sign out',
            16
        ).setOrigin(0.5);
        
        this.signOutContainer = this.scene.add.container(
            this.scene.width / 2 - this.scene.gameBgWidth / 2 + containerWidth + 10,
            30,
            [signOutBg, signOutText]
        );

        signOutBg.on('pointerover', () => {
            signOutBg.setFillStyle(0x9f8a76);
            this.scene.game.canvas.style.cursor = 'pointer';
        })
        signOutBg.on('pointerout', () => {
            signOutBg.setFillStyle(0x8f7a66);
            this.scene.game.canvas.style.cursor = 'default';
        })
        signOutBg.on('pointerdown', () => {
            signOutBg.setFillStyle(0x7f6a56);
        })
        signOutBg.on('pointerup', async () => {
            signOutBg.setFillStyle(0x8f7a66);
            try {
                await signOutUser();
                if (this.userProfileContainer) {
                    this.userProfileContainer.destroy();
                }
                if (this.signOutContainer) {
                    this.signOutContainer.destroy();
                }
                this.createSignInContainer();
            } catch (error) {
                console.error("Failed to sign in:", error);
            }
        })
    }

    private createTopScoreContainer() {
        const containerWidth = 200;
        const containerHeight = this.scene.gameBgHeight;
        const containerX = this.scene.width / 2 - this.scene.gameBgWidth / 2 - containerWidth - 20;
        const containerY = 150;

        const bg = this.scene.add.rectangle(0, 0, containerWidth, containerHeight, 0xbbada0)
            .setOrigin(0);

        const titleText = this.scene.add.bitmapText(
            containerWidth / 2,
            20,
            'wendy',
            'TOP 10 PLAYERS',
            20
        ).setOrigin(0.5, 0);

        this.topScoreContainer = this.scene.add.container(
            containerX,
            containerY,
            [bg, titleText]
        );

        this.topScoresUnsubscribe = subscribeToTopScores(10, (scores) => {
            this.updateTopScoresUI(scores);
        })
    }
    
    updateTopScoresUI(scores: TopScore[]) {
        this.topScoreContainer.getAll().forEach((item, index) => {
            if (index > 1) item.destroy();
        })

        scores.forEach((score, index) => {
            const yPos = 60 + (index * 40);
            const color = GameUI.TOP_SCORES_COLORS[index];

            const rankText = this.scene.add.bitmapText(
                20,
                yPos,
                'wendy',
                `#${index + 1}`,
                16
            ).setTint(color);

            const nameText = this.scene.add.bitmapText(
                50,
                yPos,
                'wendy',
                score.userName.split(' ')[0],
                16
            ).setTint(color);

            const scoreText = this.scene.add.bitmapText(
                180,
                yPos,
                'wendy',
                score.bestScore.toString(),
                16
            ).setOrigin(1, 0).setTint(color);

            this.topScoreContainer.add([rankText, nameText, scoreText]);
        })
    }

    destroy() {
        if (this.topScoresUnsubscribe) {
            this.topScoresUnsubscribe();
        }
    }
}