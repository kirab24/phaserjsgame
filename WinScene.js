class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('winScreen', 'assets/backgrounds/pixelsky.png');
    }

    create() {
        let background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'winScreen').setOrigin(0.5);

        // 'you win' text
        let winText = this.add.text(500, 200, 'You Win!', {
            fontFamily: '"Luckiest Guy"',
            fontSize: '64px',
            fill: '#87CEEB'
        }).setOrigin(0.5);

        // send back to main menu button
        let mainMenuButton = this.add.text(500, 350, 'Main Menu', {
            fontFamily: '"Luckiest Guy"',
            fontSize: '32px',
            fill: '#87CEEB'
        }).setInteractive({ useHandCursor: true })
          .setOrigin(0.5);

        // main menu button clicky
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('IntroScene'); 
            this.sound.stopAll();
        });
    }
}
