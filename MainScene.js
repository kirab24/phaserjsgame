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
        this.load.image('background', 'assets/backgrounds/Main.png');
    }

    create() {
        let bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background').setOrigin(0.5);
    
        // Calculate the scale required for the image to fill the screen
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);


        this.slimesKilled = 0;
        this.slimesKilledText = this.add.text(16, 16, 'Slimes Killed: 0', { fontSize: '32px', fill: '#000' });
    
        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 1000; i += 35) {
            this.platforms.create(i, 550, 'grass').setScale(0.5).refreshBody();
        }
        this.platforms.create(500, 400, 'grass').setScale(0.5).refreshBody();

        
        // Function to create a platform of a specified width (in tiles)
        const createWidePlatform = (x, y, width) => {
            for (let i = 0; i < width; i++) {
                this.platforms.create(x + (i * 35), y, 'grass').setScale(0.5).refreshBody();
            }
        };

        // Elevated platforms, 5 tiles wide
        createWidePlatform(50, 450, 5); 
        createWidePlatform(800, 450, 5); 


    
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

    updateSlimeMovement(slime) {
        // Check if slime is moving left or right and flip accordingly
        if (slime.body.velocity.x < 0) {
            slime.flipX = false; // Don't flip sprite if moving left (default faces left)
        } else if (slime.body.velocity.x > 0) {
            slime.flipX = true; // Flip sprite to face right if moving right
        }
    
        // Reverse direction at world bounds
        if (slime.body.blocked.left || slime.body.blocked.right) {
            slime.direction *= -1;
        }
        slime.setVelocityX(50 * slime.direction);
    }

    spawnSlimes() {
        const numSlimes = Phaser.Math.Between(2, 5);
        for (let i = 0; i < numSlimes; i++) {
            const xPosition = Phaser.Math.Between(50, 950);
            let slime = this.slimes.create(xPosition, 500, 'slime').setScale(0.5);
            slime.setBounce(0.5);
            slime.setCollideWorldBounds(true);
            slime.setVelocityX(Phaser.Math.Between(-50, 50));
            slime.direction = slime.body.velocity.x > 0 ? 1 : -1; // Determine initial direction
        }
    }


    hitSlime(player, slime) {
        if (player.body.touching.down && slime.body.touching.up) {
            player.setVelocityY(-100); // Bounce off
            slime.setTexture('slime_squashed'); // Change to squashed texture
            this.time.delayedCall(500, () => {
                slime.disableBody(true, true); // Remove slime after a delay
            });
            this.slimesKilled++;
            this.slimesKilledText.setText('Slimes Killed: ' + this.slimesKilled);
            if (this.slimesKilled < 15 && this.slimes.countActive(true) === 0) {
                this.spawnSlimes(); // Respawn slimes if needed
            }
            if (this.slimesKilled >= 15) {
                console.log('You win!'); // Handle winning condition
            }
        } else {
            this.resetGame(); // Player dies if not landing on top
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
            this.player.setVelocityY(-250);
         }
         
         this.slimes.children.iterate((slime) => {
            this.updateSlimeMovement(slime);
        });
    }

    showDeathScreen() {
        // Create a semi-transparent overlay
        this.add.rectangle(500, 300, 1000, 600, 0xC8A2C8, 0.5);
    
        let deathText = this.add.text(500, 200, 'You Died!', { 
            fontFamily: '"Luckiest Guy"', 
            fontSize: '64px', 
            fill: '#ff1493' // Soft pink color for a cute look
        }).setOrigin(0.5);
    
        let restartButton = this.add.text(500, 350, 'Restart', { 
            fontFamily: '"Luckiest Guy"', 
            fontSize: '32px', 
            fill: '#ff69b4'
        }).setInteractive({ useHandCursor: true }) 
          .setOrigin(0.5);
    
        // When the restart button is clicked, restart the game
        restartButton.on('pointerdown', () => {
            this.scene.restart(); // Restart the current scene
        });
    
        // button to go back to the main menu/intro screen
        let mainMenuButton = this.add.text(500, 450, 'Main Menu', { 
            fontFamily: '"Luckiest Guy"', 
            fontSize: '32px', 
            fill: '#ff69b4'
        }).setInteractive({ useHandCursor: true })
          .setOrigin(0.5);
    
        // When the main menu button is clicked, start the intro scene
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('IntroScene'); // Transition to the IntroScene
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