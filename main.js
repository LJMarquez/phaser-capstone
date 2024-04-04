class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', './tiles/dungeon-01.json');

        this.load.spritesheet('playerIdle',
        'character/Knight_Idle.png',
        { frameWidth: 52, frameHeight: 52 }
        );
        this.load.spritesheet('playerWalk',
        'character/Knight_Move.png',
        { frameWidth: 52, frameHeight: 52 }
        );
    }

    create() {
        this.scene.start('game');
    }
}

let cursors;
let player;
let facingLeft = false;
let facingUp = false;
let walkingX;
let walkingUp;
let walkingDown;
class Game extends Phaser.Scene {

    constructor() {
        super('game');
    }

    preload() {
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();

        const map = this.make.tilemap({ key: 'dungeon' });
        const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16);

        map.createLayer('Ground', tileset);
        const wallsLayer = map.createLayer('Walls', tileset);

        wallsLayer.setCollisionByProperty({ collides: true });

        const debugGraphics = this.add.graphics().setAlpha(0.7);
        wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });

        // this.anims.create({
        //     key: 'playerWalk',
        //     frames: this.anims.generateFrameNumbers('kroolWalk', { start: 0, end: 7 }),
        //     frameRate: 10,
        //     repeat: 20
        // });

        this.anims.create({
            key: 'playerIdle',
            frames: [ { key: 'playerIdle', frame: 0 } ],
            frameRate: 15
        });

        this.anims.create({
            key: 'playerWalkD',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'playerWalkDD',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 4, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'playerWalk',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 8, end: 11 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'playerWalkDU',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 12, end: 15 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'playerWalkU',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 16, end: 19 }),
            frameRate: 15,
            repeat: -1
        });

        player = this.physics.add.sprite(128, 128, 'playerIdle');
        // player.setScale(2);
        player.body.setSize(player.width * 0.3, player.height * 0.5);
        // player.body.offset.x = 40;
        // player.body.offset.y = 38;

        this.physics.add.collider(player, wallsLayer);
        this.cameras.main.startFollow(player, true);

    }

    update() {
        if (facingLeft) {
            player.setFlipX(true);
        } else {
            player.setFlipX(false);
        }

        if (cursors.left.isDown) {
            // player.setVelocityX(-100);
            facingLeft = true;
            walkingX = true;
        } else if (cursors.right.isDown) {
            // player.setVelocityX(100);
            facingLeft = false;
            walkingX = true;
        } else if (cursors.right.isUp && cursors.left.isUp) {
            walkingX = false;
        }
    
        if (cursors.up.isDown) {
            // player.setVelocityY(-100);
            walkingUp = true;
            walkingDown = false;
        } else if (cursors.down.isDown) {
            // player.setVelocityY(100);
            walkingDown = true;
            walkingUp = false;
        }

        if (walkingX && walkingDown) {
            player.anims.play('playerWalkDD', true);
            if (facingLeft) {
                player.setVelocity(-100, 100);
            } else {
                player.setVelocity(100, 100);
            }
        } else if (walkingX && walkingUp) {
            player.anims.play('playerWalkDU', true);
            if (facingLeft) {
                player.setVelocity(-100, -100);
            } else {
                player.setVelocity(100, -100);
            }
        } else if (walkingX) {
            player.anims.play('playerWalk', true);
            if (facingLeft) {
                player.setVelocity(-100, 0);
            } else {
                player.setVelocity(100, 0);
            }
        } else if (walkingUp) {
            player.anims.play('playerWalkU', true);
            player.setVelocity(0, -100);
        } else if (walkingDown) {
            player.anims.play('playerWalkD', true);
            player.setVelocity(0, 100);
        }
        
        if (cursors.up.isUp && cursors.down.isUp && cursors.left.isUp && cursors.right.isUp) {
            player.setVelocity(0);
            player.anims.play('playerIdle', true);
            walkingDown = false;
            walkingUp = false;
            walkingX = false;
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 400,
    height: 250,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true
        }
    },
    scene: [Preloader, Game],
    scale: {
        zoom: 2
    }
})