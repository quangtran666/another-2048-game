import {Scene} from "phaser";

export default class Bootloader extends Scene {
    constructor() {
        super({key: "Bootloader"});
    }
    
    preload() {
        this.setLoadEvents();
        this.loadFonts();
    }

    private loadFonts() {
        this.load.bitmapFont("wendy", "assets/fonts/starshipped.png", "assets/fonts/starshipped.xml");
    }

    private setLoadEvents() {
        this.load.on("complete", () => {
            this.scene.start("GameScene");
        }, this);
    }
}