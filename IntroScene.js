// IntroScene.js
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#C8A2C8'); // Set background color

        // Display game introduction and rules here
        this.add.text(this.cameras.main.centerX, 100, 'Welcome to Chiikawa The Slayer!', { fontFamily: '"Luckiest Guy"', fontSize: '48px', fill: '#ff1493' }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 200, 'Rules:\n1. Avoid ghosts.\n2. Jump on slimes to defeat them.\n3. Win by defeating 15 slimes.', { fontFamily: '"Luckiest Guy"', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Start game button
        let startButton = this.add.text(this.cameras.main.centerX, 400, 'Start Game', { fontFamily: '"Luckiest Guy"', fontSize: '32px', fill: '#ff69b4' }).setInteractive().setOrigin(0.5);
        startButton.on('pointerdown', () => this.scene.start('MainScene'));
    }
}
