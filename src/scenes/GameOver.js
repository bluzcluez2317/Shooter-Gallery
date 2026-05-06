class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.bitmapText(200, 250, "rocketSquare", "GAME OVER").setScale(2);
        this.add.bitmapText(180, 320, "rocketSquare", "Press SPACE to restart");

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GalleryShooters');
        });
    }
}