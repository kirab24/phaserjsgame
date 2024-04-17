class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Preloading the title screen background along with the other assets
        this.load.image('titleScreenBackground', 'assets/backgrounds/TitleScreen.png');
        this.load.image('TitleScreenForeground', 'assets/backgrounds/TitleScreenForeground.png');
        this.load.audio('gameMusic', 'assets/sounds/GameMusic.wav');
        this.load.audio('buttonClick', 'assets/sounds/buttoneffect.mp3');
        this.load.audio('buttonClick', 'assets/sounds/buttoneffect.mp3');
        this.load.image('hachiwareFront', 'assets/Hachiware/hachiwareFront.png');
        this.load.image('hachiwareBack', 'assets/Hachiware/hachiwareBack.png');
    }

    create() {
        // Adding the title screen background image
        let bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'titleScreenBackground').setOrigin(0.5);
    
        // Calculate the scale required for the image to fill the screen
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);


        // Adding and scaling the title screen foreground image
        let fg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'TitleScreenForeground').setOrigin(0.5);
        fg.setScale(scale).setScrollFactor(0);

        // Displaying animated game title
        let titleText = this.add.text(this.cameras.main.centerX, 100, 'Slime Jumper', { fontFamily: '"Luckiest Guy"', fontSize: '48px', fill: '#ff1493' }).setOrigin(0.5);
        this.tweens.add({
            targets: titleText,
            y: 120,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

        // Rules text with a subtle entrance animation
        let rulesText = this.add.text(this.cameras.main.centerX, 200, 'Rules:\n1. Avoid ghosts.\n2. Jump on slimes to defeat them.\n3. Win by defeating 15 slimes.', { fontFamily: '"Luckiest Guy"', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        rulesText.alpha = 0;
        this.tweens.add({
            targets: rulesText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        this.hachiBack = this.add.sprite(370, 400, 'hachiwareBack', 'HachiwareBack.png').setScale(0.2);
        this.tweens.add({
            targets: this.hachiBack,
            y: 410,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

        this.hachiFront = this.add.sprite(630, 400, 'hachiwareFront', 'HachiwareFront.png').setScale(0.2);
        this.tweens.add({
            targets: this.hachiFront,
            y: 410,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

        // Start game button with hover effect and sound
        let startButton = this.add.text(this.cameras.main.centerX, 400, 'Start Game', { fontFamily: '"Luckiest Guy"', fontSize: '32px', fill: '#ff69b4' }).setInteractive().setOrigin(0.5);
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff1493'}));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#ff69b4'}));
        startButton.on('pointerdown', () => {
            this.sound.play('buttonClick', { volume: 1.0 }); // Play button click sound
            this.scene.start('MainScene'); // Transition to MainScene
        });
        

        // Play the background music loaded in the preload method
        this.sound.play('gameMusic', {
            loop: true,
            volume: 0.5
        });
    }
}
