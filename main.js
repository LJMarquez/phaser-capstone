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
    this.load.spritesheet("playerAttack", "character/Knight_Attack.png", {
      frameWidth: 52,
      frameHeight: 52,
    });
    this.load.spritesheet("enemyWalk", "enemies/undead_walk.png", {
      frameWidth: 56,
      frameHeight: 48,
    });
    this.load.spritesheet("enemyIdle", "enemies/undead_idle.png", {
      frameWidth: 56,
      frameHeight: 48,
    });
  }

  create() {
    this.scene.start("game");
  }
}

const debugDraw = (layer, scene) => {
    const debugGraphics = scene.add.graphics().setAlpha(0.7);
    layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
}

// const direction = { direction: {
//     "up"
//     "down"
//     "left"
//     "right"
// }

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
let direction;

const randomDirection = (exclude) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }
  return newDirection
}

class Skeleton extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.anims.play("enemyWalk", true);

    // this.body.onCollide = true;

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true
    })

    this.direction = LEFT;

    scene.physics.world.enable(this);
    // this.setScale(0.65);
    this.body.setSize(this.width * 0.6, this.height * 0.6);
    this.body.offset.y = 13;
    this.body.offset.x = 5;
  }

  handleTileCollision(go, tile) {
    if (go !== this) {
      return
    }

    // const newDirection = Phaser.Math.Between(0, 3);
    this.direction = randomDirection(this.direction);
  }
  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) {
      case UP:
        this.setVelocityY(-50);
        break;
      case DOWN:
        this.setVelocityY(50);
        break;
      case LEFT:
        this.setVelocityX(-50);
        this.setFlipX(true);
        this.body.offset.x = 18;
        break;
      case RIGHT:
        this.setVelocityX(50);
        this.setFlipX(false);
        this.body.offset.x = 5;
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
    key: "playerAttackD",
    frames: anims.generateFrameNumbers("playerAttack", { start: 0, end: 3 }),
    frameRate: 15,
    repeat: 0,
  });

  // anims.create({
  //   key: "playerAttackDD",
  //   frames: [{ key: "playerAttack", frame: 1 }],
  // });

  // anims.create({
  //   key: "playerAttack",
  //   frames: [{ key: "playerAttack", frame: 2 }],
  // });

  // anims.create({
  //   key: "playerAttackDU",
  //   frames: [{ key: "playerAttack", frame: 3 }],
  // });

  // anims.create({
  //   key: "playerAttackU",
  //   frames: [{ key: "playerAttack", frame: 4 }],
  // });

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
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "enemyIdle",
    frames: anims.generateFrameNumbers("enemyIdle", { start: 0, end: 17 }),
    frameRate: 10,
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

    debugDraw(wallsLayer, this);

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
      createCallback: (go) => {
        const skelGo = go;
        skelGo.body.onCollide = true;
      }
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

    // if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    if (cursors.space.isDown) {
      
      switch (currentDirection) {
        case "down":
          player.anims.play("playerAttackD", true);
          console.log("Attacking")
          break;
        case "up":
          player.anims.play("playerAttackU");
          break;
        case "straight":
          player.anims.play("playerAttack");
          break;
        case "diagonal down":
          player.anims.play("playerAttackDD");
          break;
        case "diagonal up":
          player.anims.play("playerAttackDU");
          break;
      }      
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
