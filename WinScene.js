class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    create() {
        this.add.rectangle(500, 300, 1000, 600, 0x000000, 0.5);

        let winText = this.add.text(500, 200, 'You Win!', {
            fontFamily: '"Luckiest Guy"',
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        let mainMenuButton = this.add.text(500, 350, 'Main Menu', {
            fontFamily: '"Luckiest Guy"',
            fontSize: '32px',
            fill: '#ffffff'
        }).setInteractive({ useHandCursor: true })
          .setOrigin(0.5);

        mainMenuButton.on('pointerdown', () => {
            this.scene.start('IntroScene'); 
        });
    }
}
