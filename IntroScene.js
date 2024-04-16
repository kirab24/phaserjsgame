class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Preload the background image
        // this.load.image('introBackground', 'path/to/your/background/image.png');

        // Preload the game music
        this.load.audio('gameMusic', 'assets/sounds/GameMusic.wav');

        // Preload any other assets (images, particles, etc.) here
    }

    create() {
        this.cameras.main.setBackgroundColor('#C8A2C8');

        // using a background image:
        // this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'introBackground').setOrigin(0.5);

        let titleText = this.add.text(this.cameras.main.centerX, 100, 'Welcome to Chiikawa The Slayer!', { fontFamily: '"Luckiest Guy"', fontSize: '48px', fill: '#ff1493' }).setOrigin(0.5);
        this.tweens.add({
            targets: titleText,
            y: 120,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

        let rulesText = this.add.text(this.cameras.main.centerX, 200, 'Rules:\n1. Avoid ghosts.\n2. Jump on slimes to defeat them.\n3. Win by defeating 15 slimes.', { fontFamily: '"Luckiest Guy"', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        rulesText.alpha = 0;
        this.tweens.add({
            targets: rulesText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        let startButton = this.add.text(this.cameras.main.centerX, 400, 'Start Game', { fontFamily: '"Luckiest Guy"', fontSize: '32px', fill: '#ff69b4' }).setInteractive().setOrigin(0.5);
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff1493'}));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#ff69b4'}));
        startButton.on('pointerdown', () => this.scene.start('MainScene'));

        // Play the preloaded game music
        this.sound.play('gameMusic', {
            loop: true,
            volume: 0.5
        });
    }
}
