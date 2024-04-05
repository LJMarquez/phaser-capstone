class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "tiles/dungeon_tiles.png");
    this.load.tilemapTiledJSON("dungeon", "./tiles/dungeon-01.json");

    this.load.spritesheet("playerIdle", "character/Knight_Idle.png", {
      frameWidth: 52,
      frameHeight: 52,
    });
    this.load.spritesheet("playerWalk", "character/Knight_Move.png", {
      frameWidth: 52,
      frameHeight: 52,
    });
    this.load.spritesheet("enemyWalk", "enemies/undead_walk.png", {
      frameWidth: 56,
      frameHeight: 48,
    });
    this.load.spritesheet("enemyIdle", "enemies/skeletonIdle.png", {
      frameWidth: 128,
      frameHeight: 96,
    });
  }

  create() {
    this.scene.start("game");
  }
}

// const direction = { direction: {
//     "up"
//     "down"
//     "left"
//     "right"
// }

const up = "0";
const down = "1";
const left = "2";
const right = "3";
let direction;

class Skeleton extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.anims.play("enemyWalk", true);

    this.direction = right;

    scene.physics.world.enable(this);
    // this.setScale(0.65);
    this.body.setSize(this.width * 0.5, this.height * 0.65); // Set body size
    this.body.offset.y = 35;
    this.body.offset.x = -5;
  }
  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) {
      case up:
        this.setVelocityY(-50);
        break;
      case down:
        this.setVelocityY(50);
        break;
      case left:
        this.setVelocityX(-50);
        break;
      case right:
        this.setVelocityX(50);
        break;
    }
  }
}

const createPlayerAnims = (anims) => {
  anims.create({
    key: "playerIdleD",
    frames: [{ key: "playerIdle", frame: 0 }],
  });

  anims.create({
    key: "playerIdleDD",
    frames: [{ key: "playerIdle", frame: 1 }],
  });

  anims.create({
    key: "playerIdle",
    frames: [{ key: "playerIdle", frame: 2 }],
  });

  anims.create({
    key: "playerIdleDU",
    frames: [{ key: "playerIdle", frame: 3 }],
  });

  anims.create({
    key: "playerIdleU",
    frames: [{ key: "playerIdle", frame: 4 }],
  });

  anims.create({
    key: "playerWalkD",
    frames: anims.generateFrameNumbers("playerWalk", { start: 0, end: 3 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "playerWalkDD",
    frames: anims.generateFrameNumbers("playerWalk", { start: 4, end: 7 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "playerWalk",
    frames: anims.generateFrameNumbers("playerWalk", { start: 8, end: 11 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "playerWalkDU",
    frames: anims.generateFrameNumbers("playerWalk", { start: 12, end: 15 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "playerWalkU",
    frames: anims.generateFrameNumbers("playerWalk", { start: 16, end: 19 }),
    frameRate: 15,
    repeat: -1,
  });
};

const createEnemyAnims = (anims) => {
  anims.create({
    key: "enemyWalk",
    frames: anims.generateFrameNumbers("enemyWalk", { start: 0, end: 7 }),
    frameRate: 5,
    repeat: -1,
  });

  anims.create({
    key: "enemyIdle",
    frames: anims.generateFrameNumbers("enemyIdle", { start: 0, end: 3 }),
    frameRate: 2,
    repeat: -1,
  });
};

let cursors;
let player;
let skeletons;
let facingLeft = false;
let currentDirection = "down";
let walkingX;
let walkingUp;
let walkingDown;
class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {}

  create() {
    createPlayerAnims(this.anims);
    createEnemyAnims(this.anims);

    cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16);

    map.createLayer("Ground", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // wallsLayer.renderDebug(debugGraphics, {
    //     tileColor: null,
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    // });

    // start of player code

    player = this.physics.add.sprite(128, 128, "playerIdle");
    // player.setScale(2);
    player.body.setSize(player.width * 0.25, player.height * 0.4);
    // player.body.offset.x = 40;
    // player.body.offset.y = 38;

    this.cameras.main.startFollow(player, true);

    // end of player code

    // start of enemy code

    skeletons = this.physics.add.group({
      classType: Skeleton,
    });

    skeletons.get(150, 150, "skeleton");

    // end of enemy code

    this.physics.add.collider(player, wallsLayer);
    this.physics.add.collider(skeletons, wallsLayer);
  }

  update() {
    // start of player logic
    if (facingLeft) {
      player.setFlipX(true);
    } else {
      player.setFlipX(false);
    }

    if (cursors.left.isDown) {
      facingLeft = true;
      walkingX = true;
    } else if (cursors.right.isDown) {
      facingLeft = false;
      walkingX = true;
    } else if (cursors.right.isUp && cursors.left.isUp) {
      walkingX = false;
    }

    if (cursors.up.isDown) {
      walkingUp = true;
      walkingDown = false;
    } else if (cursors.down.isDown) {
      walkingDown = true;
      walkingUp = false;
    }
    if (cursors.up.isUp) {
      walkingUp = false;
    }
    if (cursors.down.isUp) {
      walkingDown = false;
    }

    if (walkingX && walkingDown) {
      player.anims.play("playerWalkDD", true);
      currentDirection = "diagonal down";
      if (facingLeft) {
        player.setVelocity(-100, 100);
      } else {
        player.setVelocity(100, 100);
      }
    } else if (walkingX && walkingUp) {
      player.anims.play("playerWalkDU", true);
      currentDirection = "diagonal up";
      if (facingLeft) {
        player.setVelocity(-100, -100);
      } else {
        player.setVelocity(100, -100);
      }
    } else if (walkingX) {
      player.anims.play("playerWalk", true);
      currentDirection = "straight";
      if (facingLeft) {
        player.setVelocity(-100, 0);
      } else {
        player.setVelocity(100, 0);
      }
    } else if (walkingUp) {
      player.anims.play("playerWalkU", true);
      currentDirection = "up";
      player.setVelocity(0, -100);
    } else if (walkingDown) {
      player.anims.play("playerWalkD", true);
      currentDirection = "down";
      player.setVelocity(0, 100);
    }

    if (
      cursors.up.isUp &&
      cursors.down.isUp &&
      cursors.left.isUp &&
      cursors.right.isUp
    ) {
      player.setVelocity(0);
      walkingDown = false;
      walkingUp = false;
      walkingX = false;
      switch (currentDirection) {
        case "down":
          player.anims.play("playerIdleD", true);
          break;
        case "up":
          player.anims.play("playerIdleU");
          break;
        case "straight":
          player.anims.play("playerIdle");
          break;
        case "diagonal down":
          player.anims.play("playerIdleDD");
          break;
        case "diagonal up":
          player.anims.play("playerIdleDU");
          break;
      }
    }
    // end of player logic
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 250,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, Game],
  scale: {
    zoom: 2,
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH
  },
});
