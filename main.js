class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', './tiles/dungeon-01.json');

        this.load.spritesheet('playerIdle',
        'character/Color-1/_Idle.png',
        { frameWidth: 120, frameHeight: 80 }
        );
        // this.load.spritesheet('kroolIdle', 
        // 'assets/krool-idle.png',
        // { frameWidth: 50, frameHeight: 48}
        // );
    }

    create() {
        this.scene.start('game');
    }
}

class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {
    }

    create() {
        const map = this.make.tilemap({ key: 'dungeon' });
        const tileset = map.addTilesetImage('dungeon', 'tiles');

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
            frameRate: 10,
            repeat: -1
        });

        const player = this.add.sprite(128, 128, 'playerIdle');
        player.anims.play('playerIdle');

    }

    update() {
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 400,
    height: 250,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [Preloader, Game],
    scale: {
        zoom: 2
    }
})