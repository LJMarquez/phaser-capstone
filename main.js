class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon-tiles.png');
        this.load.tilemapTiledJSON('dungeon', './tiles/dungeon-1.json');
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
        const map = this.make.tileMap({ key: 'dungeon' });
        const tileset = map.addTilesetImage('dungeon', 'tiles');

        map.createStaticLayer("Ground", tileset);
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