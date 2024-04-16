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
let platforms;
let slimesKilled = 0; // Counter for the slimes killed

const game = new Phaser.Game(config);

function preload() {
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

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    slimesKilledText = this.add.text(16, 16, 'Slimes Killed: 0', { fontSize: '32px', fill: '#000' });

    //dont touch this one
    const platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 1000; i += 35) {
        platforms.create(i, 550, 'grass').setScale(0.5).refreshBody();
    }
    //continue editing

    platforms.create(500, 400, 'grass').setScale(0.5).refreshBody();

    player = this.physics.add.sprite(500, 350, 'chiikawa', 'chiikawaFront.png').setScale(0.2);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    slimes = this.physics.add.group();

    spawnSlimes();ghosts = this.physics.add.group({
        key: 'ghost_normal',
        repeat: 2,
        setXY: { x: 800, y: 0, stepX: 150 }
    });
    ghosts.children.iterate(function (ghost) {
        ghost.setScale(0.5).setVelocityX(Phaser.Math.Between(-100, 100));
        ghost.setCollideWorldBounds(true).setBounce(1, 0);
    });

    this.physics.add.collider(slimes, platforms);
    this.physics.add.collider(ghosts, platforms);
    this.physics.add.collider(player, slimes, hitSlime, null, this);
    this.physics.add.collider(player, ghosts, avoidGhost, null, this);
    this.physics.add.collider(player, platforms);

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

function spawnSlimes() {
    const numSlimes = Phaser.Math.Between(2, 5); // Spawn between 2 and 5 slimes
    for (let i = 0; i < numSlimes; i++) {
        const xPosition = Phaser.Math.Between(50, 950); // Ensure they spawn within the game bounds
        const slime = slimes.create(xPosition, 500, 'slime').setScale(0.5);
        slime.setCollideWorldBounds(true);
        slime.setVelocityX(Phaser.Math.Between(-50, 50)); // Give some initial random movement
        slime.setBounce(1);
    }
}


function hitSlime(player, slime) {
    if (player.body.touching.down && slime.body.touching.up) {
        player.setVelocityY(-330); // Bounce off
        slime.disableBody(true, true); // Effectively "kill" the slime
        slimesKilled++;
        slimesKilledText.setText('Slimes Killed: ' + slimesKilled); // Update the counter display
        
        // Check if all slimes are killed and total killed is still under 15
        if (slimesKilled < 15 && slimes.countActive(true) === 0) {
            spawnSlimes.call(this); // Spawn more slimes
        }
        
        if (slimesKilled >= 15) {
            // Implement game win logic here
            console.log('You win!');
        }
    } else {
        resetGame.call(this); // Ensure the correct context is used
    }
}


function avoidGhost(player, ghost) {
    resetGame.call(this); // Reset game on any collision with a ghost
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('front');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function resetGame() {
    // Reset player position to initial spawn point
    player.setPosition(500, 350);
    slimesKilled = 0; // Reset slimes killed counter
    slimesKilledText.setText('Slimes Killed: ' + slimesKilled); // Update the counter display

    // Clear all slimes and respawn
    slimes.clear(true, true); 
    spawnSlimes.call(this); // Make sure to call spawnSlimes with the correct context

}