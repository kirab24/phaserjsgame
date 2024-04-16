class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Preload the background image
        //this.load.image('introBackground', 'path/to/your/introBackground.png'); // Update the path as necessary

        // Preload the game music and button click sound effect
        this.load.audio('gameMusic', 'assets/sounds/GameMusic.wav');
        this.load.audio('buttonClick', 'assets/sounds/buttoneffect.mp3');
    }

    create() {
        this.cameras.main.setBackgroundColor('#C8A2C8');

        // Adding a background image
        //this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'introBackground').setOrigin(0.5);

        // Display animated game title
        let titleText = this.add.text(this.cameras.main.centerX, 100, 'Welcome to Chiikawa The Slayer!', { fontFamily: '"Luckiest Guy"', fontSize: '48px', fill: '#ff1493' }).setOrigin(0.5);
        this.tweens.add({
            targets: titleText,
            y: 120,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

        // Animated rules text
        let rulesText = this.add.text(this.cameras.main.centerX, 200, 'Rules:\n1. Avoid ghosts.\n2. Jump on slimes to defeat them.\n3. Win by defeating 15 slimes.', { fontFamily: '"Luckiest Guy"', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        rulesText.alpha = 0;
        this.tweens.add({
            targets: rulesText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        // Start game button with hover effect and sound
        let startButton = this.add.text(this.cameras.main.centerX, 400, 'Start Game', { fontFamily: '"Luckiest Guy"', fontSize: '32px', fill: '#ff69b4' }).setInteractive().setOrigin(0.5);
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff1493'}));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#ff69b4'}));
        startButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { volume: 1.0 }); // Play button click sound
            this.scene.start('MainScene'); // Transition to MainScene
        });

        // Optional particle effects for additional flair
        let particles = this.add.particles('sparkle');
        particles.createEmitter({
            speed: 100,
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
        });

        // Play the background music loaded in the preload method
        this.sound.play('gameMusic', {
            loop: true,
            volume: 0.5
        });
    }
}
