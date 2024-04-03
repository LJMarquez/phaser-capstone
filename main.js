class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', './tiles/dungeon-01.json');

        this.load.spritesheet('playerIdle',
        'character/Color-2/_Idle.png',
        { frameWidth: 120, frameHeight: 80 }
        );
        this.load.spritesheet('playerWalk',
        'character/Color-2/_Run.png',
        { frameWidth: 120, frameHeight: 80 }
        );
    }

    create() {
        this.scene.start('game');
    }
}

let cursors;
let player;
let facingLeft = false;
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
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'playerWalk',
            frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        player = this.physics.add.sprite(128, 128, 'playerIdle');
        // player.setScale(0.9);
        player.body.setSize(player.width * 0.25, player.height * 0.55);
        player.body.offset.x = 40;
        player.body.offset.y = 38;

        this.physics.add.collider(player, wallsLayer);
        this.cameras.main.startFollow(player, true);

    }

    update() {
        if (facingLeft) {
            player.setFlipX(true);
            player.body.offset.x = 50;
        } else {
            player.setFlipX(false);
            player.body.offset.x = 40;
        }
        if (cursors.left.isDown) {
            player.setVelocity(-100, 0);
            player.anims.play('playerWalk', true);
            facingLeft = true;
        } else if (cursors.right.isDown) {
            player.setVelocity(100, 0);
            player.anims.play('playerWalk', true);
            facingLeft = false;
        } else if (cursors.up.isDown) {
            player.setVelocity(0, -100);
            player.anims.play('playerWalk', true);
        } else if (cursors.down.isDown) {
            player.setVelocity(0, 100);
            player.anims.play('playerWalk', true);
        // } else if (cursors.left.isDown && cursors.up.isDown) {
        //     player.setVelocity(-100, 100);
        } else {
            player.setVelocity(0);
            player.anims.play('playerIdle', true);
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