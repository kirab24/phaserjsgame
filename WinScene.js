class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('winScreen', 'assets/backgrounds/pixelsky.png');
    }

    create() {
        // Create a semi-transparent overlay
        this.add.rectangle(500, 300, 1000, 600, 0x000000, 0.5);

        let background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'winScreen').setOrigin(0.5);

        // Display a "You Win!" message
        let winText = this.add.text(500, 200, 'You Win!', {
            fontFamily: '"Luckiest Guy"',
            fontSize: '64px',
            fill: '#87CEEB'
        }).setOrigin(0.5);

        // Button to go back to the main menu
        let mainMenuButton = this.add.text(500, 350, 'Main Menu', {
            fontFamily: '"Luckiest Guy"',
            fontSize: '32px',
            fill: '#87CEEB'
        }).setInteractive({ useHandCursor: true })
          .setOrigin(0.5);

        mainMenuButton.on('pointerdown', () => {
            this.scene.start('IntroScene'); 
            this.sound.stopAll();
        });
    }
}
