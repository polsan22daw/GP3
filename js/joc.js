var config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1000 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player,
    platforms,
    collapsingPlatforms,
    oneWayPlatforms,
    enemigo,
    coins,
    pinchos,
    proyectil,
    cannon,
    lava,
    lava2,
    lavaTimer,
    lavaSpeed = 1,
    iniciarLava = false,
    cursors,
    acceleration = 1000,
    jumpVelocity = -550,
    wasStanding = false,
    edgeTimer = 0,
    jumping = false;

var game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL("assets/");
    this.load.image("ground", "platform.jpg");
    this.load.image("hero", "hero.jpg");
    this.load.image("fallPlat", "oneway-platform.png");
    this.load.image("coin", "coin.png");
    this.load.image("movimientoPlat", "one-way-platform.jpg");
    this.load.image("enemigo", "fire.gif");
    this.load.image("pinchos", "spikes.png");
    this.load.image("proyectil", "proyectil.jpg");
    this.load.image("ground2", "one-way-platform.jpg");
    this.load.spritesheet('cannon', 'canon.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('lava', 'lava.png', { frameWidth: 288, frameHeight: 32, endFrame: 9});
}


let isPlayerMoving = false;


function create() {
    this.physics.world.setBounds(-100, -10000, config.width + 100, config.height + 10000);

    var logo = this.add.sprite(config.width / 2, config.height / 2, 'logo');
    logo.alpha = 0.4;
    logo.setScale(0.5);

    createPlayer.call(this);
    createLava.call(this);
    

    platforms = this.physics.add.staticGroup();
    platform2 = this.physics.add.staticGroup();
    collapsingPlatforms = this.physics.add.staticGroup();
    coins = this.physics.add.staticGroup();
    pinchos = this.physics.add.staticGroup();

    // Columnas de derecha e izquierda
    var leftColumn = this.add.rectangle(25, config.height / 2, 100, config.height + 10000, 0xff0000);
    var rightColumn = this.add.rectangle(config.width - 25, config.height / 2, 100, config.height + 10000, 0xff0000);
    this.physics.add.existing(leftColumn, true);
    this.physics.add.existing(rightColumn, true);
    //hacer la primera plataforma que ocupe el 100% de la pantalla y que sea la que esté más abajo
    // platforms.create(config.width / 2, config.height, "ground").setScale(3).refreshBody();
    platform2.create(config.width / 2, 670, "ground2").setScale(3).refreshBody();
    platform2.create(config.width / 2, 590, "ground2").setScale(2).refreshBody();


    //crear una plataforma en el centro de la pantalla
    platforms.create(config.width / 2, 420, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 - 320, 300, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 + 320, 300, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 - 120, 180, "ground").setScale(0.5).refreshBody();
    crearEnemigo.call(this, 350, 156,170);
    platforms.create(config.width / 2 + 120, 60, "ground").setScale(0.5).refreshBody();
    collapsingPlatforms.create(config.width / 2 - 150, -40, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(config.width / 2 + 380, -40, "fallPlat").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 + 120, -180, "ground").setScale(0.5).refreshBody();
    createMovingPlatform.call(this, config.width / 2 - 100, -300, 150, -300);

    //barredora
    platforms.create(config.width / 2 - 400, -320, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 - 400, -460, "ground").setScale(0.5).refreshBody();
    var platBarredora = this.physics.add.sprite(config.width / 2 - 460, -390, "ground").setScale(0.35).setAngle(90);
    platBarredora.setSize(platBarredora.height, platBarredora.width, true);
    platBarredora.setImmovable(true);
    platBarredora.body.allowGravity = false;
    platBarredora.refreshBody();
    // Configurar la animación de movimiento
    this.tweens.add({
        targets: platBarredora,
        x: platBarredora.x + 200,
        esase: 'Linear',
        duration: 4000,
        repeat: -1,
        yoyo: true
    });

    crearSaltador.call(this, -100, 456);
    crearSaltador.call(this, 100, 566);


    crearPinchos.call(this, 320, 606);
    crearPinchos.call(this, 820, 606);

    crearCannon.call(this, 35, 566);
    crearCannon.call(this, 35, 466);

    // Position the player on the lowest platform
    // player.x = lowestPlatform.x;
    // player.y = lowestPlatform.y - 80;
    player.x = 700;
    player.y = 540;

    heightText = this.add.text(16, 50, "Height: 0", {
        fontSize: "24px",
        fill: "#fff"
    });


    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platform2);
    this.physics.add.collider(player, collapsingPlatforms, shakePlatform, checkOneWay, this);

    // this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.collider(player, leftColumn);
    this.physics.add.collider(player, rightColumn);
    this.physics.add.overlap(player, null, this);

    // this.physics.add.collider(player, pinchos, chocarPinchos, null, this);

    // Find the lowest platform
    var lowestPlatform = platforms.getChildren()[0];
    platforms.getChildren().forEach(function (platform) {
        if (platform.y > lowestPlatform.y) {
            lowestPlatform = platform;
        }
    });

}

function crearSaltador(x, y) {
    var saltador = this.physics.add.sprite(650, 650, "coin").setScale(1.5);
    saltador.setCollideWorldBounds(true);
    saltador.x = config.width / 2 - x;
    saltador.y = y;
    saltador.setImmovable(true);
    saltador.body.allowGravity = false;
    saltador.body.checkCollision.down = false;
    this.physics.add.collider(saltador, platforms);
    this.physics.add.collider(player, saltador, mecanicaSaltador, null, this);
}
function mecanicaSaltador(player, saltador) {
    if (saltador.body.touching.up) {
        player.setVelocityY(-600);
    }
}
function createMovingPlatform(x, y, displayWidth, distance) {
    var movingPlatform = this.physics.add.sprite(x, y, "ground");
    movingPlatform.setImmovable(true);
    movingPlatform.setScale(0.5);
    movingPlatform.body.allowGravity = false;
    movingPlatform.displayWidth = displayWidth;
    movingPlatform.refreshBody();

    this.tweens.add({
        targets: movingPlatform,
        x: movingPlatform.x + distance,
        ease: "Linear",
        duration: 2000,
        repeat: -1,
        yoyo: true,
    });

    this.physics.add.collider(player, movingPlatform);
}

function crearCannon(x, y) {
    var cannon = this.add.sprite(x, y, 'cannon').setScale(2.2).setDepth(1);
    this.anims.create({
        key: 'cannonFire',
        frames: this.anims.generateFrameNumbers('cannon', { start: 0, end: 4 }),
        frameRate: 1,
        repeat: -1
    });
    cannon.anims.play('cannonFire');

    //proyectil
    var proyectil = this.physics.add.sprite(x, y + 10, "proyectil");
    proyectil.setImmovable(true);
    proyectil.body.allowGravity = false;
    proyectil.refreshBody();

    this.tweens.add({
        targets: proyectil,
        x: proyectil.x + 1300,
        ease: "Linear",
        duration: 5000,
        repeat: -1,
        delay: 2000,
    });

    this.physics.add.collider(player, proyectil, chocarPinchos, null, this);
}

function crearEnemigo (x, y,distancia) {
    enemigo = this.physics.add.sprite(x, y, "enemigo");
    // enemigo.setImmovable(true);
    enemigo.body.allowGravity = false;
    enemigo.refreshBody();
    enemigo.body.velocity.x = 100;
    enemigo.maxDistance = distancia;
    enemigo.previousX = enemigo.x;
    this.physics.add.collider(player, enemigo, chocarEnemigo, null, this);
    this.physics.add.collider(enemigo, platforms);
}

function chocarEnemigo(player, baddie) {
    //if the collision is on the baddies head
    if (baddie.body.touching.up) {
        // set baddie as being hit by removing physics
        baddie.disableBody(false, false);
        //make player jump up in the air a little bit
        player.setVelocityY(-1000);

        //animate baddie, fading out and getting bigger
        var tween = this.tweens.add({
            targets: baddie,
            alpha: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Linear',
            duration: 200,
            onComplete: function () {
                //remove the game object
                destroyGameObject(baddie);
            },
        });
    }
    //otherwise you've hit baddie, but not on the head. This makes you die
    else {
        //set player to dead
        player.disableBody(false, false);

        //animate players death scene
        var tween = this.tweens.add({
            targets: player,
            alpha: 0.3,
            scaleX: 1.1,
            scaleY: 1.1,
            angle: 90,
            x: player.x - 20,
            y: player.y - 20,
            ease: 'Linear',
            duration: 200,
            onComplete: function () {
                restartGame(this);
            },
            onCompleteScope: this
        });
    }
}
function crearPinchos(x, y) {
    var pinchitos = this.physics.add.sprite(x, y, "pinchos");
    pinchitos.enableBody = true;
    pinchitos.body.allowGravity = false;
    pinchitos.body.immovable = true;
    this.physics.add.collider(pinchitos, platforms);
    this.physics.add.collider(player, pinchitos, chocarPinchos, null, this);

}

function chocarPinchos(player, baddie) {
    //if the collision is on the baddies head
    if (baddie.body.touching) {
        player.disableBody(false, false);

        //animate players death scene
        var tween = this.tweens.add({
            targets: player,
            alpha: 0.3,
            scaleX: 1.1,
            scaleY: 1.1,
            angle: 90,
            x: player.x - 20,
            y: player.y - 20,
            ease: 'Linear',
            duration: 200,
            onComplete: function () {
                restartGame(this);
            },
            onCompleteScope: this
        });
    }
}


function update() {
    if (player.body.velocity.x !== 0 && iniciarLava == false) {
        iniciarLava = true;
    }

    //si la lava llega a la altura del jugador, muere
    if (lava.y <= player.y) {
        player.disableBody(false, false);

        //animate players death scene
        var tween = this.tweens.add({
            targets: player,
            alpha: 0.3,
            scaleX: 1.1,
            scaleY: 1.1,
            angle: 90,
            x: player.x - 20,
            y: player.y - 20,
            ease: 'Linear',
            duration: 200,
            onComplete: function () {
                restartGame(this);
            },
            onCompleteScope: this
        });
    }

    var standing = player.body.blocked.down || player.body.touching.down;
    handlePlayerMovement.call(this, standing);
    handleJumping.call(this, standing);

    if (Math.abs(enemigo.x - enemigo.previousX) >= enemigo.maxDistance) {
        switchDirection(enemigo);
    }



    this.cameras.main.setBounds(0, -10000, config.width, config.height + 10000);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    heightText.setText("Height: " + Math.round(player.y));//* -1/50
    heightText.setScrollFactor(0);
    wasStanding = standing;
}

function switchDirection(enemigo) {
    //reverse velocity so baddie moves are same speed but in opposite direction
    enemigo.body.velocity.x *= -1;
    //reset count
    enemigo.previousX = enemigo.x;
}
function createPlayer() {
    player = this.physics.add.sprite(650, 650, "hero");
    player.setCollideWorldBounds(true);
    player.setBounce(0);
    player.body.maxVelocity.x = 340;
    player.body.maxVelocity.y = 1000;
    cursors = this.input.keyboard.createCursorKeys();
}

function handlePlayerMovement(standing) {
    if (cursors.left.isDown) {
        if (standing) {
            player.setAccelerationX(-acceleration);
        } else {
            player.setAccelerationX(-acceleration / 3);
        }
    } else if (cursors.right.isDown) {
        if (standing) {
            player.setAccelerationX(acceleration);
        } else {
            player.setAccelerationX(acceleration / 3);
        }
    } else {
        if (Math.abs(player.body.velocity.x) < 10 && Math.abs(player.body.velocity.x) > -10) {
            player.setVelocityX(0);
            player.setAccelerationX(0);
        } else {
            player.setAccelerationX((player.body.velocity.x > 0 ? -2 : 2) * acceleration / 3);
        }
    }
}

function handleJumping(standing) {
    const time = new Date().getTime();

    if (!standing && wasStanding) {
        edgeTimer = time + 100;
    }

    if ((standing || time <= edgeTimer) && cursors.up.isDown && !jumping) {
        player.setVelocityY(jumpVelocity);
        jumping = true;
    }

    if (!cursors.up.isDown) {
        if (player.body.touching.down) {
            jumping = false;
        }
    }
}

function shakePlatform(player, platform) {
    //only make platform shake if player is standing on it
    if (player.body.blocked.down) {
        //do a little camera shake to indicate something bad is going to happen
        this.cameras.main.shake(200, 0.001);
        //we need to store the global scope here so we can keep it later
        var ourScene = this;
        //do a yoyo tween shaking the platform back and forth and up and down
        var tween = this.tweens.add({
            targets: platform,
            yoyo: true,
            repeat: 10,
            x: {
                from: platform.x,
                to: platform.x + 0,
            },
            ease: 'Linear',
            duration: 25,
            onComplete: function () {
                destroyPlatform.call(ourScene, platform);
            }
        });
    }
}

function checkOneWay(player, oneway) {
    //if player is higher up the screen then the plaform then enable the collision
    if (player.y < oneway.y) {
        return true;
    }
    //otherwise disable collision
    return false;
}

function destroyPlatform(platform) {
    var tween = this.tweens.add({
        targets: platform,
        alpha: 0,
        y: "+=25",
        ease: 'Linear',
        duration: 100,
        onComplete: function () {
            destroyGameObject(platform);
        }
    });
}

function destroyGameObject(gameObject) {
    // Removes any game object from the screen
    gameObject.destroy();
}
function restartGame(game) {
    game.scene.restart();
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
}

function createLava() {
    // Crea la lava como un sprite utilizando un spritesheet
    lava = this.add.sprite(550, config.height-70, 'lava').setScale(4).setDepth(10);
    lava2 = this.add.rectangle(550, config.height, config.width, -50, 0xff0000).setDepth(9);

    // lava.setOrigin(0, 1);
    this.physics.add.existing(lava, true);
  
    // Establece la animación de subida de la lava
    this.anims.create({
      key: 'lavaRise',
      frames: this.anims.generateFrameNumbers('lava', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    lava.anims.play('lavaRise');
  
    // Inicia el temporizador para que la lava suba periódicamente
    lavaTimer = this.time.addEvent({
      delay: 100, // Intervalo de tiempo en milisegundos
      callback: riseLava, // Función a ejecutar cuando el temporizador se complete
      callbackScope: this,
      loop: true // Hacer que el temporizador se repita infinitamente
    });
  }
  
  function riseLava() {
    if (iniciarLava) {
        lava2.height -= lavaSpeed;
        // lava2.body.height -= lavaSpeed;
      // Hace que la lava suba cambiando su posición vertical
        lava.y -= lavaSpeed;

    }
  }