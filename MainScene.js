class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        // Declare variables as class properties here
        this.player = null;
        this.cursors = null;
        this.slimes = null;
        this.ghosts = null;
        this.platforms = null;
        this.slimesKilled = 0; // Counter for the slimes killed
        this.slimesKilledText = null; // Text object for displaying the count
    }


     preload() {
        this.load.image('grass', 'assets/grass/grass.png');
        this.load.image('grassCenter_rounded', 'assets/grass/grassCenter_rounded.png');
        this.load.image('grassCenter', 'assets/grass/grassCenter.png');
        this.load.image('grassCliffLeft', 'assets/grass/grassCliffLeft.png');
        this.load.image('grassCliffRight', 'assets/grass/grassCliffRight.png');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('ghost_dead', 'assets/enemies/ghost_dead.png');
        this.load.image('ghost_hit', 'assets/enemies/ghost_hit.png');
        this.load.image('ghost_normal', 'assets/enemies/ghost_normal.png');
        this.load.image('ghost', 'assets/enemies/ghost.png');
        this.load.image('slime_dead', 'assets/enemies/slime_dead.png');
        this.load.image('slime_squashed', 'assets/enemies/slime_squashed.png');
        this.load.image('slime_walk', 'assets/enemies/slime_walk.png');
        this.load.image('slime', 'assets/enemies/slime.png');

        this.load.atlas('chiikawa', 'assets/Chiikawa/spritesheetChiikawa.png', 'assets/Chiikawa/spritesheetChiikawa.json');

    }

     create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.slimesKilledText = this.add.text(16, 16, 'Slimes Killed: 0', { fontSize: '32px', fill: '#000' });
    
        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 1000; i += 35) {
            this.platforms.create(i, 550, 'grass').setScale(0.5).refreshBody();
        }
        this.platforms.create(500, 400, 'grass').setScale(0.5).refreshBody();
    
        this.player = this.physics.add.sprite(500, 350, 'chiikawa', 'chiikawaFront.png').setScale(0.2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.slimes = this.physics.add.group();
        this.spawnSlimes();
        
        this.ghosts = this.physics.add.group({
            key: 'ghost_normal',
            repeat: 2, 
            setXY: { x: 800, y: 500, stepX: 150 } 
        });
        this.ghosts.children.iterate((ghost) => {
            ghost.setScale(0.5).setVelocityX(Phaser.Math.Between(-100, 100));
            ghost.setCollideWorldBounds(true).setBounce(1, 0);
        });
        
        this.physics.add.collider(this.slimes, this.platforms);
        this.physics.add.collider(this.ghosts, this.platforms);
        this.physics.add.collider(this.player, this.slimes, this.hitSlime, null, this);
        this.physics.add.collider(this.player, this.ghosts, this.avoidGhost, null, this);
        this.physics.add.collider(this.player, this.platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('chiikawa', {
                start: 1, end: 2, prefix: 'chiikawaRunLeft', suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('chiikawa', {
                start: 1, end: 2, prefix: 'chiikawaRunRight', suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'front',
            frames: [{ key: 'chiikawa', frame: 'chiikawaFront.png' }],
            frameRate: 20
        });

        this.anims.create({
            key: 'back',
            frames: [{ key: 'chiikawa', frame: 'chiikawaBack.png' }],
            frameRate: 20
        });
    }

     spawnSlimes() {
        const numSlimes = Phaser.Math.Between(2, 5); // Spawn between 2 and 5 slimes
        for (let i = 0; i < numSlimes; i++) {
            const xPosition = Phaser.Math.Between(50, 950); // Ensure they spawn within the game bounds
            this.slime = this.slimes.create(xPosition, 500, 'slime').setScale(0.5);
            this.slime.setCollideWorldBounds(true);
            this.slime.setVelocityX(Phaser.Math.Between(-50, 50)); // Give some initial random movement
            this.slime.setBounce(1);
        }
    }


    hitSlime(player, slime) {
        if (this.player.body.touching.down && slime.body.touching.up) {
            this.player.setVelocityY(-100); // Bounce off
            slime.disableBody(true, true); // Effectively "kill" the slime
            this.slimesKilled++;
            this.slimesKilledText.setText('Slimes Killed: ' + this.slimesKilled); // Update the counter display
    
            // Check if all slimes are killed and total killed is still under 15
            if (this.slimesKilled < 15 && this.slimes.countActive(true) === 0) {
                this.spawnSlimes(); 
            }
    
            if (this.slimesKilled >= 15) {
                // Implement game win logic here
                console.log('You win!');
            }
        } else {
            this.resetGame(); 
        }
    }
    


     avoidGhost(player, ghost) {
        this.resetGame.call(this); // Reset game on any collision with a ghost
    }

     update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('front');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-200);
        }
    }

     showDeathScreen() {
        // Create a semi-transparent overlay
        this.add.rectangle(500, 300, 1000, 600, 0xC8A2C8, 0.5);

        let deathText = this.add.text(500, 200, 'You Died!', { 
            fontFamily: '"Luckiest Guy"', 
            fontSize: '64px', 
            fill: '#ff1493' // Soft pink color for a cute look
        });
        deathText.setOrigin(0.5);

        let restartButton = this.add.text(500, 400, 'Restart', { 
            fontFamily: '"Luckiest Guy"', 
            fontSize: '32px', 
            fill: '#ff69b4'
        })
        .setInteractive({ useHandCursor: true }) 
        .setOrigin(0.5);

        // When the button is clicked, restart the game
        restartButton.on('pointerdown', () => {
            this.scene.restart(); // Restart the current scene
        });
    }



     resetGame() {
        this.showDeathScreen.call(this); // Show the death screen
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [IntroScene, MainScene] // Include the intro scene and main scene in the configuration
};

const game = new Phaser.Game(config);