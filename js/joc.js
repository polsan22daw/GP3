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
    coins,
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
}




function create() {
    this.physics.world.setBounds(-100, -10000, config.width + 100, config.height + 10000);

    var logo = this.add.sprite(config.width / 2, config.height / 2, 'logo');
    logo.alpha = 0.4;
    logo.setScale(0.5);

    platforms = this.physics.add.staticGroup();
    collapsingPlatforms = this.physics.add.staticGroup();
    coins = this.physics.add.staticGroup();

    // var platformHeight = 130;
    // var numPlatforms = Math.ceil((config.height + 10000) / platformHeight);

    //hacer la primera plataforma que ocupe el 100% de la pantalla y que sea la que esté más abajo
    platforms.create(config.width / 2, config.height, "ground").setScale(3).refreshBody();
    //crear una plataforma en el centro de la pantalla
    platforms.create(config.width / 2, 520, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 -320, 400, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 + 320, 400, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 - 120, 280, "ground").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 + 120, 160, "ground").setScale(0.5).refreshBody();
    collapsingPlatforms.create(config.width / 2 - 150, 40, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(config.width / 2 +380, 40, "fallPlat").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 +120, -80, "ground").setScale(0.5).refreshBody();
    coins.create(config.width / 2, 400, "coin").setScale(1).refreshBody();




    var movingPlatform = this.physics.add.sprite(config.width / 2 -100, -200, "ground");
    movingPlatform.setImmovable(true);
    movingPlatform.setScale(0.5);
    movingPlatform.body.allowGravity = false;
    // movingPlatform.body.checkCollision.up = false;
    // movingPlatform.body.checkCollision.left = false;
    // movingPlatform.body.checkCollision.right = false;

    // Ajusta el tamaño de la plataforma móvil
    movingPlatform.displayWidth = 150;
    movingPlatform.refreshBody();

    // Crea la animación de movimiento de derecha a izquierda
    this.tweens.add({
        targets: movingPlatform,
        x: movingPlatform.x - 300, // Distancia total que se moverá la plataforma

        ease: 'Linear', // Tipo de interpolación
        duration: 2000, // Duración en milisegundos
        repeat: -1, // -1 para repetir infinitamente
        yoyo: true // Hace que la animación se repita hacia adelante y hacia atrás
    });
    


    //generar el resto de plataformas pero la primera un poco mas arriba
    //generatePlatforms(numPlatforms - 1)

    // Create left and right columns
    var leftColumn = this.add.rectangle(25, config.height / 2, 100, config.height + 10000, 0xff0000);
    var rightColumn = this.add.rectangle(config.width - 25, config.height / 2, 100, config.height + 10000, 0xff0000);
    this.physics.add.existing(leftColumn, true);
    this.physics.add.existing(rightColumn, true);

    player = this.physics.add.sprite(650, 650, "hero");
    player.setCollideWorldBounds(true);

    //Set bounce to 0, so our hero just lands directly
    player.setBounce(0);
    //Set top speeds
    player.body.maxVelocity.x = 340;
    player.body.maxVelocity.y = 1000;

    cursors = this.input.keyboard.createCursorKeys();

    heightText = this.add.text(16, 50, "Height: 0", {
        fontSize: "24px",
        fill: "#fff"
    });

    // coins = this.physics.add.group({
    //     key: 'coin',
    //     repeat: 1,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });
    

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, collapsingPlatforms, shakePlatform, checkOneWay, this);
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(player, coins);
    this.physics.add.collider(player, movingPlatform);


    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.collider(player, leftColumn);
    this.physics.add.collider(player, rightColumn);
    this.physics.add.overlap(player, null, this);

    // Find the lowest platform
    var lowestPlatform = platforms.getChildren()[0];
    platforms.getChildren().forEach(function (platform) {
        if (platform.y > lowestPlatform.y) {
            lowestPlatform = platform;
        }
    });

    // Position the player on the lowest platform
    player.x = lowestPlatform.x;
    player.y = lowestPlatform.y - 80;

    // function generatePlatforms(count) {
    //     for (var i = 0; i < count; i++) {
    //         platforms.create(config.width / 3, -10000 + i * platformHeight, "ground").refreshBody();
    //         platforms.children.entries[i].body.checkCollision.down = false;
    //         platforms.children.entries[i].body.checkCollision.left = false;
    //         platforms.children.entries[i].body.checkCollision.right = false;
    //     }
    // }
}


function update() {

    var standing = player.body.blocked.down || player.body.touching.down;
    //if left key is down then move left
    if (cursors.left.isDown) {
        //if hero is on ground then use full acceleration
        if (standing) {
            player.setAccelerationX(-acceleration);
        } else {
            //if hero is in the air then accelerate slower
            player.setAccelerationX(-acceleration / 3);
        }
    } else if (cursors.right.isDown) {
        //same deal but for right arrow
        if (standing) {
            player.setAccelerationX(acceleration);
        } else {
            player.setAccelerationX(acceleration / 3);
        }
    } else {
        //if neither left or right arrow is down then...
        //if hero is close to having no velocity either left or right then set velocity to 0. This stops jerky back and forth as the hero comes to a halt. i.e. as we slow hero down, below a certain point we just stop them moving altogether as it looks smoother
        if (
            Math.abs(player.body.velocity.x) < 10 &&
            Math.abs(player.body.velocity.x) > -10
        ) {
            player.setVelocityX(0);
            player.setAccelerationX(0);
        } else {
            //if our hero isn't moving left or right then slow them down
            //this velocity.x check just works out whether we are setting a positive (going right) or negative (going left) number
            player.setAccelerationX(
                (player.body.velocity.x > 0 ? -1 : 1) * acceleration / 3
            );
        }
    }

    //get current time in seconds
    var d = new Date();
    var time = d.getTime();

    //if we have just left the ground set edge time for 100ms time
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
    this.cameras.main.setBounds(0, -10000, config.width, config.height + 10000);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    heightText.setText("Height: " + Math.round(player.y));//* -1/50
    heightText.setScrollFactor(0);
    wasStanding = standing;
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
            onComplete: function() {
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
        onComplete: function() {
            destroyGameObject(platform);
        }
    });
}

function destroyGameObject(gameObject) {
    // Removes any game object from the screen
    gameObject.destroy();
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
}