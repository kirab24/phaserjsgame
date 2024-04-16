const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let slimes; 
let ghosts;

const game = new Phaser.Game(config);

function preload() {
    // Loading the grass tiles
    this.load.image('grass', 'assets/grass/grass.png');
    this.load.image('grassCenter_rounded', 'assets/grass/grassCenter_rounded.png');
    this.load.image('grassCenter', 'assets/grass/grassCenter.png');
    this.load.image('grassCliffLeft', 'assets/grass/grassCliffLeft.png');
    this.load.image('grassCliffRight', 'assets/grass/grassCliffRight.png');

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

function create() {
    // Create platforms using the grass tiles
    const platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 800; i += 70) { // Adjust based on your tile size
        platforms.create(i, 550, 'grassCenter').setScale(0.5).refreshBody(); // Example of creating ground
    }

    platforms.create(400, 400, 'grassCenter_rounded').setScale(0.5).refreshBody(); // Example of a higher platform

    // Player setup
    player = this.physics.add.sprite(100, 450, 'character');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // Player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'character', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    // Creating slimes
    slimes = this.physics.add.group();
    const slime = slimes.create(200, 500, 'slime').setScale(0.5);
    slime.hitCount = 0; // To track how many times it's been hit
    
    // Creating ghosts
    ghosts = this.physics.add.group();
    const ghost = ghosts.create(600, 500, 'ghost_normal').setScale(0.5);
    ghost.setVelocityX(-100); // Ghost moving slowly
    ghost.setCollideWorldBounds(true);
    ghost.setBounce(1, 0); // Make the ghost bounce off world bounds

    this.physics.add.collider(slimes, platforms);
    this.physics.add.collider(ghosts, platforms);
    this.physics.add.collider(player, slimes, hitSlime, null, this);
    this.physics.add.collider(player, ghosts, avoidGhost, null, this);

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

    // Assuming you have a variable for the player character
    player = this.physics.add.sprite(100, 450, 'chiikawa', 'chiikawaFront.png');
}

function hitSlime(player, slime) {
    if (player.body.touching.down && slime.body.touching.up) {
        slime.hitCount++;
        player.setVelocityY(-330); // Bounce off
        if (slime.hitCount >= 2) {
            slime.setTexture('slime_dead');
            slime.body.stop();
            // Optionally, make the slime disappear after a delay
            this.time.delayedCall(1000, () => {
                slime.destroy();
            });
        } else {
            slime.setTexture('slime_squashed');
            // Reset texture after a short delay
            this.time.delayedCall(500, () => {
                slime.setTexture('slime');
            });
        }
    } else {
        // Handle player damage or reset here
    }
}

function avoidGhost(player, ghost) {
    // Handle player encountering a ghost
    // Maybe reset player to start or reduce health
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        // Optionally, choose to stand facing front or back when not moving
        player.anims.play('front');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        // Optionally play 'back' animation when jumping
    }
}
