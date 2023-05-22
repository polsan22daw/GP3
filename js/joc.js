var escenaComienzo = new Phaser.Scene('escenaComienzo');

escenaComienzo.preload = function () {
    this.load.spritesheet('pj', 'assets/pj.png', { frameWidth: 50, frameHeight: 37 });
    this.load.audio('inicio', 'assets/audios/inicio.mp3');
};

escenaComienzo.create = function () {
    var musica = this.sound.add('inicio');
    musica.play({ loop: true });

    var animacion = this.add.sprite(550, 300, 'pj').setScale(3).setDepth(1);

    // Definir la configuración de la animación
    var config = {
        key: 'empezar',
        frames: this.anims.generateFrameNumbers('pj', { start: 9, end: 14 }),
        frameRate: 10,
        repeat: -1
    };

    // Crear la animación
    this.anims.create(config);

    // Reproducir la animación
    animacion.anims.play('empezar');

    // Añadir texto
    this.add.text(550, 460, 'CLICK TO START', { fontSize: 32, color: '#ffffff', align: 'center' })
        .setShadow(4, 4, "#000000", 2, false, true)
        .setOrigin(0.5)
        .setDepth(3);

    this.add.text(550, 80, 'Titulo del juego', { fontSize: 32, color: '#ffffff', align: 'center' })
        .setShadow(4, 4, "#000000", 2, false, true)
        .setOrigin(0.5)
        .setDepth(3);

    // Fondo light blue
    this.cameras.main.setBackgroundColor('black');

    // Añadir evento para pasar a la siguiente escena
    this.input.on('pointerdown', function (pointer) {
        // Shut down this scene and start up the game scene
        escenaComienzo.scene.start('escenaJoc');
        // Restart the scene to reset all the variables
        escenaJoc.scene.restart();
        musica.stop();

    });
};
var escenaFinal = new Phaser.Scene('escenaFinal');

escenaFinal.preload = function () {
    this.load.spritesheet('pj', 'assets/pj.png', { frameWidth: 50, frameHeight: 37 });
    this.load.audio('gameover', 'assets/audios/gameover.mp3');
};

var musicaFinal;
escenaFinal.create = function () {
    // escenaComienzo.scene.restart();
    musicaFinal = this.sound.add('gameover');
    musicaFinal.play({ loop: true });

    var animacion = this.add.sprite(550, 300, 'pj').setScale(3).setDepth(1);

    // Definir la configuración de la animación
    var config = {
        key: 'fin',
        frames: this.anims.generateFrameNumbers('pj', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
    };

    // Crear la animación
    this.anims.create(config);

    // Reproducir la animación
    animacion.anims.play('fin');

    //add some text
    this.add.text(550, 460, 'HAS MUERTO\nCLICK TO START', { fontSize: 32, color: '#ffffff', align: 'center' }).setShadow(4, 4, "#000000", 2, false, true).setOrigin(0.5).setDepth(3);;

    this.input.on('pointerdown', function (pointer) {
        //shut down this scene and start up the game scene
        escenaFinal.scene.start('escenaComienzo');
        //restart the scene to reset all the variables!
        escenaComienzo.scene.restart();
        musicaFinal.stop();

    });
}

var escenaGanar = new Phaser.Scene('escenaGanar');

escenaGanar.preload = function () {
    this.load.audio('ganar', 'assets/audios/victoria.mp3');
};

escenaGanar.create = function () {
    var musica = this.sound.add('ganar');
    musica.play({ loop: true });
    //add some text
    this.add.text(550, 460, 'HAS GANADO\nCLICK TO START', { fontSize: 32, color: '#ffffff', align: 'center' }).setShadow(4, 4, "#000000", 2, false, true).setOrigin(0.5).setDepth(3);;
    this.input.on('pointerdown', function (pointer) {
        //shut down this scene and start up the game scene
        escenaGanar.scene.start('escenaComienzo');
        musica.stop();

    });
};

function ganarJuego(player, finish) {
    musicaJuego.stop();
    musicaJuego.destroy();
    this.scene.start('escenaGanar');
}

var escenaJoc = new Phaser.Scene('escenaJoc');

escenaJoc.init = function () {
    player = null,
        musicaJuego = null,
        efectoGolpe = null,
        vidasOutlines = [],
        vidas = [],
        maxVidas = 3,
        vulnerableTime = 1000,
        murcielago = null;
    murcielagos = [];
    platforms = null,
        collapsingPlatforms = null,
        oneWayPlatforms = null,
        enemigo = null,
        coins = null,
        pinchos = null,
        proyectil = null,
        proyectiles = [],
        cannon = null,
        canones = [],
        lava = null,
        lava2 = null,
        lavaTimer = null,
        lavaSpeed = 1,
        iniciarLava = false,
        cursors = null,
        acceleration = 1000,
        jumpVelocity = -550,
        wasStanding = false,
        edgeTimer = 0,
        jumping = false;
}



escenaJoc.preload = function () {
    this.load.setBaseURL("assets/");
    // this.load.image("comienzo", "comienzo.jpg");
    this.load.image("ground", "platform.jpg");
    this.load.image("hero", "hero.jpg");
    this.load.image("fallPlat", "oneway-platform.png");
    this.load.image("movimientoPlat", "one-way-platform.jpg");
    this.load.image("enemigo", "fire.gif");
    this.load.spritesheet('murcielago', 'bat.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image("pinchos", "pinchos.png");
    this.load.spritesheet('saltador', 'saltador.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image("proyectil", "proyectil.jpg");
    this.load.image("ground2", "one-way-platform.jpg");
    this.load.spritesheet('cannon', 'canon.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('lava', 'lava.png', { frameWidth: 288, frameHeight: 288, endFrame: 9 });
    this.load.image("columna", "columna.jpg");
    this.load.image("muro", "muro.png");
    this.load.image("planaPlat", "planaPlat.png");
    this.load.image("fallingPlat", "fallingPlat.png");
    this.load.image("paredPlat", "paredPlat.png");
    this.load.image("fondo", "fondo.png");
    this.load.spritesheet('pj', 'pj.png', { frameWidth: 50, frameHeight: 37 });
    this.load.image("vida", "vida.png");
    this.load.image("sinvida", "sinvida.png");
    this.load.audio('musicaJuego', 'audios/juego.mp3');
    this.load.audio('golpeado', 'audios/golpe.wav');
}


let isPlayerMoving = false;

escenaJoc.create = function () {
    this.physics.world.setBounds(-100, -10000, config.width + 100, config.height + 10000);
    var backgroundImage = this.add.image(0, 0, 'columna').setOrigin(0, 0);

    // Escalar la imagen para que se ajuste al tamaño deseado
    var scaleFactor = this.sys.game.canvas.height / backgroundImage.height;
    backgroundImage.setScale(scaleFactor);

    // Fondo
    var fondo = this.add.tileSprite(config.width / 2, config.height / 2, config.width, config.height + 10000, 'fondo');

    // Ajustar el origen del tileSprite
    fondo.setOrigin(0.5, 0.5);

    // Ajustar la escala del tileSprite para que la imagen se repita verticalmente
    fondo.setScale(1, (config.height + 15200) / fondo.height);

    createPlayer.call(this);


    if (lava == null) {
        createLava.call(this);
    }

    platforms = this.physics.add.staticGroup();
    platform2 = this.physics.add.staticGroup();
    collapsingPlatforms = this.physics.add.staticGroup();
    pinchos = this.physics.add.staticGroup();


    // Columnas de derecha e izquierda
    this.load.image('columna', 'columna.jpg');
    var leftColumn = this.add.tileSprite(25, config.height / 2, 100, config.height + 10000, 'columna');
    leftColumn.setOrigin(0.5, 0.5);
    var rightColumn = this.add.tileSprite(config.width - 25, config.height / 2, 100, config.height + 10000, 'columna');
    rightColumn.setOrigin(0.5, 0.5);

    // Ajustar el tamaño de las columnas
    leftColumn.setScale(1, (config.height + 15200) / leftColumn.height);
    rightColumn.setScale(1, (config.height + 15200) / rightColumn.height);


    this.physics.add.existing(leftColumn, true);
    this.physics.add.existing(rightColumn, true);

    platform2.create(config.width / 2, 670, "muro").setScale(2).refreshBody();
    platform2.create(config.width / 2, 573, "muro").setScale(1).refreshBody();

    platforms.create(config.width / 2, 420, "planaPlat").setScale(0.7).refreshBody();
    platforms.create(config.width / 2 - 320, 300, "planaPlat").setScale(0.8).refreshBody();
    platforms.create(config.width / 2 + 320, 300, "planaPlat").setScale(1.2).refreshBody();
    platforms.create(config.width / 2 - 120, 180, "planaPlat").setScale(1).refreshBody();

    platforms.create(config.width / 2 + 120, 60, "planaPlat").setScale(1).refreshBody();
    collapsingPlatforms.create(config.width / 2 - 150, -65, "fallingPlat").setScale(0.8).refreshBody();
    collapsingPlatforms.create(config.width / 2 + 380, -65, "fallingPlat").setScale(0.8).refreshBody();
    platforms.create(config.width / 2 + 120, -180, "planaPlat").setScale(1).refreshBody();
    createMovingPlatformX.call(this, 500, -300, 150, -350);
    createMovingPlatformX.call(this, 600, -425, 150, 350);
    platforms.create(config.width / 2 - 275, -550, "muro").setScale(0.9).refreshBody();
    platforms.create(config.width / 2 + 50, -680, "planaPlat").setScale(0.5).refreshBody();
    platforms.create(config.width / 2 + 335, -810, "planaPlat").setScale(0.8).refreshBody();
    platforms.create(config.width / 2 + 5, -925, "muro").setScale(1.3).refreshBody();
    crearPinchos.call(this, 555, -983, false);
    platforms.create(config.width / 2 + -410, -1075, "paredPlat").setScale(2).refreshBody();
    platforms.create(config.width / 2 + -95, -1195, "planaPlat").setScale(1.3).refreshBody();
    platforms.create(config.width / 2 + 352, -1195, "planaPlat").setScale(1.3).refreshBody();
    crearMurcielago.call(this, 360, -1260, 220);
    crearMurcielago.call(this, 800, -1260, 220);
    var square = this.add.tileSprite(config.width / 2 - 125, -1775, 700, 500, 'columna');
    square.setTileScale(1);
    this.physics.add.existing(square, true);
    crearSaltador.call(this, 980, -1330);
    crearSaltador.call(this, 820, -1550);
    crearSaltador.call(this, 980, -1730);
    crearCannon.call(this, 35, -2190, 3000, false);
    crearPinchos.call(this, 625, -2041, false);
    crearPinchos.call(this, 425, -2041, false);
    crearPinchos.call(this, 225, -2041, false);
    crearSaltador.call(this, 120, -2140);
    collapsingPlatforms.create(400, -2280, "fallingPlat").setScale(0.8).refreshBody();
    collapsingPlatforms.create(600, -2400, "fallingPlat").setScale(0.8).refreshBody();
    collapsingPlatforms.create(800, -2520, "fallingPlat").setScale(0.8).refreshBody();
    platforms.create(978, -2640, "paredPlat").setScale(1.5).refreshBody();
    createMovingPlatformX.call(this, 800, -2770, 150, -150);
    createMovingPlatformX.call(this, 350, -2770, 100, -80);
    platforms.create(124, -2870, "paredPlat").setScale(1.5).refreshBody();
    // platforms.create(800, -3080, "ground").setScale(1).refreshBody();
    var suelo = this.add.rectangle(625, -3000, 800, 50, 0x00ff00);
    this.physics.add.existing(suelo, true);
    this.physics.add.collider(player, suelo);
    var cuadrado1 = this.add.rectangle(390, -3050, 130, 100, 0x00ff00);
    this.physics.add.existing(cuadrado1, true);
    this.physics.add.collider(player, cuadrado1);
    var cuadrado2 = this.add.rectangle(675, -3050, 130, 100, 0x00ff00);
    this.physics.add.existing(cuadrado2, true);
    this.physics.add.collider(player, cuadrado2);
    var cuadrado3 = this.add.rectangle(960, -3050, 130, 100, 0x00ff00);
    this.physics.add.existing(cuadrado3, true);
    this.physics.add.collider(player, cuadrado3);
    var techo = this.add.rectangle(550, -3415, 650, 400, 0x00ff00);
    this.physics.add.existing(techo, true);
    this.physics.add.collider(player, techo);
    crearPinchos.call(this, 515, -3200, true);
    crearPinchos.call(this, 800, -3200, true);
    crearCannon.call(this, 1060, -3155, 2500, true);
    createMovingPlatformY.call(this, 950, -3120, 100, -400);
    var plat2=platforms.create(950, -3607, "ground").setScale(0.5).refreshBody();
    plat2.body.checkCollision.down = false;
    crearSaltador.call(this, 800, -3690);
    var columna3 = this.add.rectangle(670, -3690, 95, 400, 0x00ff00);
    this.physics.add.existing(columna3, true);
    this.physics.add.collider(player, columna3);
    crearPinchos.call(this, 669, -3905, false);
    crearSaltador.call(this, 550, -3690);
    var columna4 = this.add.rectangle(430, -3690, 95, 400, 0x00ff00);
    this.physics.add.existing(columna4, true);
    this.physics.add.collider(player, columna4);
    crearPinchos.call(this, 429, -3905, false);
    crearSaltador.call(this, 310, -3690);
    platforms.create(100, -3970, "ground").setScale(0.25).refreshBody();
    collapsingPlatforms.create(400, -4110, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(650, -4230, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(400, -4350, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(650, -4470, "fallPlat").setScale(0.5).refreshBody();
    platforms.create(950, -4590, "ground").setScale(0.5).refreshBody();
    var suelo3 = this.add.rectangle(425, -4710, 700, 20, 0x00ff00);
    this.physics.add.existing(suelo3, true);
    this.physics.add.collider(player, suelo3);
    crearCannon.call(this, 1060, -4775, 2700, true);
    var suelo4 = this.add.rectangle(615, -4825, 820, 20, 0x00ff00);
    this.physics.add.existing(suelo4, true);
    this.physics.add.collider(player, suelo4);
    crearCannon.call(this, 35, -4885, 2300, false);
    var suelo5 = this.add.rectangle(425, -4940, 700, 20, 0x00ff00);
    this.physics.add.existing(suelo5, true);
    this.physics.add.collider(player, suelo5);
    crearCannon.call(this, 1060, -5005, 2700, true);
    var suelo6 = this.add.rectangle(765, -5055, 520, 20, 0x00ff00);
    this.physics.add.existing(suelo6, true);
    this.physics.add.collider(player, suelo6);
    var suelo7 = this.add.rectangle(195, -5055, 240, 20, 0x00ff00);
    this.physics.add.existing(suelo7, true);
    this.physics.add.collider(player, suelo7);
    crearPinchos.call(this, 260, -5081, false);
    crearPinchos.call(this, 125, -5081, false);
    crearMurcielago.call(this, 605, -5140, 160);
    crearPinchos.call(this, 880, -5081, false);
    collapsingPlatforms.create(985, -5190, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(985, -5320, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(985, -5440, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(985, -5560, "fallPlat").setScale(0.5).refreshBody();
    crearSaltador.call(this, 600, -5560);
    // platforms.create(100, -5380, "ground").setScale(0.25).refreshBody();
    createMovingPlatformY.call(this, 125, -5350, 100, -725);
    var suelo8 = this.add.rectangle(700, -6050, 900, 20, 0x00ff00);
    this.physics.add.existing(suelo8, true);
    this.physics.add.collider(player, suelo8);
    var sueloAbajo9 = this.add.rectangle(165, -6050, 177, 20, 0x00ff00);
    this.physics.add.existing(sueloAbajo9, true);
    this.physics.add.collider(player, sueloAbajo9);
    sueloAbajo9.body.checkCollision.down = false;
    crearCannon.call(this, 1060, -6100, 6000, true);
    crearCannon.call(this, 1060, -6225, 3000, true);
    crearMurcielago.call(this, 230, -6100, 220);
    crearPinchos.call(this, 550, -6076, false);
    crearPinchos.call(this, 650, -6076, false);
    crearMurcielago.call(this, 750, -6100, 200);
    crearSaltador.call(this, 980, -6150);
    collapsingPlatforms.create(820, -6370, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(650, -6490, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(480, -6610, "fallPlat").setScale(0.5).refreshBody();
    collapsingPlatforms.create(250, -6730, "fallPlat").setScale(0.5).refreshBody();
    crearSaltador.call(this, 120, -6850);

    platforms.create(550, -7050, "ground").setScale(0.75).refreshBody();
    platforms.create(275, -7280, "ground").setScale(1).refreshBody();
    platforms.create(825, -7280, "ground").setScale(1).refreshBody();
    //add finish rectangle
    var finish = this.add.rectangle(550, -7280, 200, 40, 0x00ff00);
    this.physics.add.existing(finish, true);
    this.physics.add.overlap(player, finish, ganarJuego, null, this);




    //barredora
    // platforms.create(config.width / 2 - 400, -320, "ground").setScale(0.5).refreshBody();
    // platforms.create(config.width / 2 - 400, -460, "ground").setScale(0.5).refreshBody();
    // var platBarredora = this.physics.add.sprite(config.width / 2 - 460, -390, "ground").setScale(0.35).setAngle(90);
    // platBarredora.setSize(platBarredora.height, platBarredora.width, true);
    // platBarredora.setImmovable(true);
    // platBarredora.body.allowGravity = false;
    // platBarredora.refreshBody();
    // // Configurar la animación de movimiento
    // this.tweens.add({
    //     targets: platBarredora,
    //     x: platBarredora.x + 200,
    //     esase: 'Linear',
    //     duration: 4000,
    //     repeat: -1,
    //     yoyo: true
    // });


    efectoGolpe = this.sound.add('golpeado');

    musicaJuego = this.sound.add('musicaJuego');
    musicaJuego.play({ loop: true });

    // Position the player on the lowest platform
    // player.x = lowestPlatform.x;
    // player.y = lowestPlatform.y - 80;
    player.x = 900;
    player.y = -3700;

    heightText = this.add.text(16, 50, "Height: 0", {
        fontSize: "24px",
        fill: "#fff"
    });


    tiempoInicio=Date.now();
    tiempoText = this.add.text(15, 100, 'Tiempo: 00:00.00', { fontSize: '16px', fill: '#ffffff' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platform2);
    this.physics.add.collider(player, collapsingPlatforms, shakePlatform, checkOneWay, this);
    this.physics.add.collider(player, square);


    for (var i = 0; i < proyectiles.length; i++) {
        var proyectil = proyectiles[i];
        this.physics.add.collider(player, proyectil, chocarEnemigo, null, this);
    };



    // this.physics.add.collider(murcielago, platforms);
    for (var i = 0; i < murcielagos.length; i++) {
        var murcielago = murcielagos[i];
        this.physics.add.overlap(player, murcielago, chocarEnemigo, null, this);
        this.physics.add.collider(murcielago, suelo6);
        this.physics.add.collider(murcielago, suelo7);
        this.physics.add.collider(murcielago, suelo8);
    };

    // this.physics.add.collider(pinchitos, platforms);
    // this.physics.add.overlap(player, pinchitos, chocarPinchos, null, this);
    // this.physics.add.collider(murcielago, platforms);
    // this.physics.add.overlap(player, murcielago, chocarEnemigo, null, this);

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
    var saltador = this.physics.add.sprite(650, 650, "saltador").setScale(1.5);
    saltador.setCollideWorldBounds(true);
    saltador.x = x;
    saltador.y = y;
    saltador.setImmovable(true);
    saltador.body.allowGravity = false;
    saltador.body.checkCollision.down = false;
    saltador.body.checkCollision.left = false;
    saltador.body.checkCollision.right = false;

    saltador.body.setSize(45, 30, 10, 10);
    saltador.refreshBody();

    this.physics.add.collider(saltador, platforms);
    this.physics.add.collider(player, saltador, mecanicaSaltador, null, this);

    this.anims.create({
        key: 'saltador',
        frames: this.anims.generateFrameNumbers('saltador', { start: 0, end: 5 }),
        frameRate: 5,
        repeat: -1
    });
    saltador.anims.play('saltador');
}
function mecanicaSaltador(player, saltador) {
    if (saltador.body.touching.up) {
        player.setVelocityY(-760);
    }
}
function createMovingPlatformX(x, y, displayWidth, distance) {
    var movingPlatform = this.physics.add.sprite(x, y, "ground");
    movingPlatform.setImmovable(true);
    movingPlatform.setScale(0.5);
    movingPlatform.body.allowGravity = false;
    movingPlatform.displayWidth = displayWidth;
    movingPlatform.body.checkCollision.down = false;
    movingPlatform.body.checkCollision.left = false;
    movingPlatform.body.checkCollision.right = false;
    movingPlatform.refreshBody();

    this.tweens.add({
        targets: movingPlatform,
        x: movingPlatform.x + distance,
        ease: "Linear",
        duration: 4000,
        repeat: -1,
        yoyo: true,
    });

    this.physics.add.collider(player, movingPlatform);

}

function createMovingPlatformY(x, y, displayWidth, distance) {
    var movingPlatform = this.physics.add.sprite(x, y, "ground");
    movingPlatform.setImmovable(true);
    movingPlatform.setScale(0.5);
    movingPlatform.body.allowGravity = false;
    movingPlatform.displayWidth = displayWidth;
    movingPlatform.body.checkCollision.down = false;
    movingPlatform.body.checkCollision.left = false;
    movingPlatform.body.checkCollision.right = false;
    movingPlatform.refreshBody();

    this.tweens.add({
        targets: movingPlatform,
        y: movingPlatform.y + distance,
        ease: "Linear",
        duration: 5200,
        repeat: -1,
        yoyo: true,
    });

    this.physics.add.collider(player, movingPlatform);

}

function crearCannon(x, y, duration, directionRight) {
    var cannon = this.add.sprite(x, y, 'cannon').setScale(2.2).setDepth(1);
    this.anims.create({
        key: 'cannonFire',
        frames: this.anims.generateFrameNumbers('cannon', { start: 0, end: 4 }),
        frameRate: 1,
        repeat: -1
    });
    cannon.anims.play('cannonFire');
    if (directionRight) {
        cannon.setFlipX(true);
    }
    //proyectil
    var proyectil = this.physics.add.sprite(x, y + 10, "proyectil");
    proyectil.setScale(0.025);
    proyectil.setTint(0xFFFF00,0.9);
    
    
    proyectil.body.allowGravity = false;
    proyectil.setOrigin(.5, .5);
    proyectil.setCollideWorldBounds(true);
    proyectil.refreshBody();
    var proyectilTweenConfig = {
        targets: proyectil,
        y: proyectil.y,
        ease: "Linear",
        duration: duration,
        repeat: -1
    };
    if (directionRight) {
        proyectilTweenConfig.x = proyectil.x - 1300;
    } else {
        proyectilTweenConfig.x = proyectil.x + 1300;
    }
    this.tweens.add(proyectilTweenConfig);
    canones.push(cannon);
    proyectiles.push(proyectil);
}
function crearMurcielago(x, y, distancia) {

    murcielago = this.physics.add.sprite(x, y, "murcielago");
    murcielago.setOrigin(.5, .5);
    murcielago.setCollideWorldBounds(true);
    // murcielago.body.allowGravity = false;
    murcielago.refreshBody();
    murcielago.body.velocity.x = 80;
    // murcielago.body.immovable = true;
    murcielago.maxDistance = distancia;
    murcielago.previousX = murcielago.x;
    murcielago.setScale(2);
    this.physics.add.collider(murcielago, platforms);

    this.anims.create({
        key: 'movBat',
        frames: this.anims.generateFrameNumbers('murcielago', { start: 0, end: 5 }),
        frameRate: 5,
        repeat: -1
    });
    murcielago.anims.play('movBat');
    murcielagos.push(murcielago);
}

function crearEnemigo(x, y, distancia) {
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
    //baddie was hit on the head and hasn't already been hit
    if (baddie.body.touching.up && !baddie.hit) {
        // set baddie as being hit and remove physics
        baddie.disableBody(false, false);
        player.setVelocityY(jumpVelocity);

        //play baddies death animation
        this.tweens.add({
            targets: baddie,
            alpha: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Linear',
            duration: 200,
            onComplete: function () {
                destroyGameObject(baddie);
            },
        });
    } else {
        jugadorTocado.call(this, player, baddie);
    }
}


function playerVulnerable(game) {
    //tween player back to 100% opacity and reset invulnerability flag
    var death = game.tweens.add({
        targets: player,
        alpha: 1,
        ease: 'Linear',
        duration: 200,
        onComplete: function () {
            player.invulnerable = false;
        },
        onCompleteScope: this
    });
}

function crearPinchos(x, y, arriba) {
    var pinchitos = this.physics.add.sprite(x, y, "pinchos");
    if (arriba) {
        pinchitos.setFlipY(true);
    }
    pinchitos.enableBody = true;
    pinchitos.setScale(2.3);
    pinchitos.body.allowGravity = false;
    pinchitos.body.immovable = true;
    this.physics.add.collider(pinchitos, platforms);
    this.physics.add.collider(player, pinchitos, chocarPinchos, null, this);

}

function chocarPinchos(player, baddie) {
    //if the collision is on the baddies head
    if (baddie.body.touching) {
        jugadorTocado.call(this, player, baddie);
    }
}

function jugadorTocado(player, baddie) {
    if (!player.invulnerable) {
        //set player as invulnerable
        player.invulnerable = true;
        //get the heart sprites from our arrays we set up earlier
        var currentHeartCount = player.vidas,
            currentHeart = vidas[currentHeartCount - 1],
            currentHeartOutline = vidasOutlines[currentHeartCount - 1];

        //fade out the heart fill
        this.tweens.add({
            targets: currentHeart,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            ease: 'Linear',
            duration: 200
        });

        //create a timeline of tweens for the heart outline so it shrinks then grows back
        var heartsTimeline = this.tweens.createTimeline();

        //this is the heart outline scaling down
        heartsTimeline.add({
            targets: currentHeartOutline,
            scaleX: 0.5,
            scaleY: 0.5,
            ease: 'Power1',
            duration: 200
        });

        //and then back
        heartsTimeline.add({
            targets: currentHeartOutline,
            scaleX: 1,
            scaleY: 1,
            ease: 'Power1',
            duration: 200
        });
        //play the timeline straight away
        heartsTimeline.play();

        //remove a heart from out count stored on the player object
        player.vidas -= 1;
        efectoGolpe.play();

        //if hearts is 0 or less you're dead as you are out of lives
        if (player.vidas <= 0) {
            //remove physics from player
            player.disableBody(false, false);
            //and play death animation
            this.tweens.add({
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
                    musicaJuego.stop();
                    restartGame(this);
                },
                onCompleteScope: this
            });
        }
        //otherwise you're not dead you've just lost a life so...
        else {
            //make the player stop in their tracks and jump up
            player.body.velocity.x = 0;
            player.body.velocity.y = -220;

            //tween the players alpha to 30%
            this.tweens.add({
                targets: player,
                alpha: 0.3,
                ease: 'Linear',
                duration: 200,
                onCompleteScope: this
            });

            //set a timer for 1 second. When this is up we tween player back to normal and make then vulnerable again
            this.time.delayedCall(vulnerableTime, playerVulnerable, [this]);
        }
    }
}


escenaJoc.update = function () {

    if (player.body.velocity.x !== 0 && iniciarLava == false) {
        iniciarLava = true;
    }
    //si la lava llega a la altura del jugador, muere
    if (lava.y + 10 <= player.y) {
        iniciarLava = false;
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

    // if (Math.abs(enemigo.x - enemigo.previousX) >= enemigo.maxDistance) {
    //     switchDirection(enemigo);
    // }


    //que haga un switchDirection por cada murcielago

    for (var i = 0; i < murcielagos.length; i++) {
        var murcielago = murcielagos[i];

        if (Math.abs(murcielago.x - murcielago.previousX) >= murcielago.maxDistance) {
            switchDirection(murcielago);
        }
    }
    // if (Math.abs(murcielago.x - murcielago.previousX) >= murcielago.maxDistance) {
    //     switchDirection(murcielago);
    // }


    this.cameras.main.setBounds(0, -10000, config.width, config.height + 10000);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // ELEMENTOS DE LA INTERFAZ
    heightText.setText("Height: " + Math.round(player.y));//* -1/50
    heightText.setScrollFactor(0);
    var tiempoActual = Date.now();
    var tiempoTranscurrido = (tiempoActual - tiempoInicio) / 1000; 
    tiempoText.setText('Tiempo: ' + tiempoTranscurrido.toFixed(2));
    tiempoText.setScrollFactor(0);
    sinVida1.setScrollFactor(0).setDepth(20);
    sinVida2.setScrollFactor(0).setDepth(20);
    sinVida3.setScrollFactor(0).setDepth(20);
    vida1.setScrollFactor(0).setDepth(20);
    vida2.setScrollFactor(0).setDepth(20);
    vida3.setScrollFactor(0).setDepth(20);
    wasStanding = standing;
    
}

function switchDirection(enemigo) {
    //reverse velocity so baddie moves are same speed but in opposite direction
    enemigo.body.velocity.x *= -1;
    //reset count
    enemigo.previousX = enemigo.x;
}
function createPlayer() {
    player = this.physics.add.sprite(100, 500, "pj").setScale(2);
    player.setCollideWorldBounds(true);
    player.setBounce(0);
    player.body.maxVelocity.x = 340;
    player.body.maxVelocity.y = 1000;

    //vidas
    player.invulnerable = false;
    player.vidas = maxVidas;

    sinVida1 = this.add.sprite(980, 38, 'sinvida'),
        sinVida2 = this.add.sprite(940, 38, 'sinvida'),
        sinVida3 = this.add.sprite(900, 38, 'sinvida');


    vidasOutlines = [sinVida1, sinVida2, sinVida3];

    vida1 = this.add.sprite(980, 38, 'vida');
    vida2 = this.add.sprite(940, 38, 'vida');
    vida3 = this.add.sprite(900, 38, 'vida');
    //Array de vidas
    vidas = [vida1, vida2, vida3];

    // AJUSTAR HITBOX Y ANIMACION
    player.setSize(16, 28);
    player.setOffset(17, 8);
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('pj', { start: 1, end: 4 }),
        frameRate: 5,
        repeat: -1
    });

    player.flipX = true;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pj', { start: 9, end: 14 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: [
            { key: 'pj', frame: 7 },
            { key: 'pj', frame: 8 },
            { key: 'pj', frame: 0 }
        ],
        frameRate: 2,
        repeat: 100000
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pj', { start: 9, end: 14 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
}
function handlePlayerMovement(standing) {
    if (cursors.left.isDown) {
        if (player.body.touching.down) {
            player.anims.play('left', true);
        } else {
            player.anims.play('up', true);
        }
        player.setFlipX(true); // Invertir el sprite horizontalmente
        if (standing) {
            player.setAccelerationX(-acceleration);
        } else {
            player.setAccelerationX(-acceleration / 3);
        }
    } else if (cursors.right.isDown) {
        if (player.body.touching.down) {
            player.anims.play('right', true);
        } else {
            player.anims.play('up', true);
        }
        player.setFlipX(false); // Restaurar la orientación normal del sprite
        if (standing) {
            player.setAccelerationX(acceleration);
        } else {
            player.setAccelerationX(acceleration / 3);
        }
    } else {
        if (player.body.touching.down) {
            player.anims.play('idle', true);
            if (Math.abs(player.body.velocity.x) < 10) {
                player.setVelocityX(0);
                player.setAccelerationX(0);
            } else {
                player.setAccelerationX((player.body.velocity.x > 0 ? -2 : 2) * acceleration / 1);
            }
        } else {
            player.anims.play('up', true);
            if (Math.abs(player.body.velocity.x) < 10) {
                player.setAccelerationX(0);
            } else {
                player.setAccelerationX((player.body.velocity.x > 0 ? -2 : 2) * acceleration / 3);
            }
        }
    }
}

function handleJumping(standing) {
    const time = new Date().getTime();

    if (!jumping && !cursors.up.isDown && !player.body.touching.down) {
        // player.anims.play('falling', true);
    }

    if ((standing || time <= edgeTimer) && cursors.up.isDown && !jumping) {
        player.anims.play('up', true);
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
    if (player.body.blocked.down) {
        // temblor de pantalla
        this.cameras.main.shake(100, 0.003);
        // Hacer un tween yoyo para hacer temblar la plataforma hacia adelante y hacia atrás y hacia arriba y hacia abajo
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
                platform.setVisible(false);
                platform.body.checkCollision.none = true;
                setTimeout(function () {
                    platform.setVisible(true);
                    platform.body.checkCollision.none = false;
                }, 4000);
            }
        });
    }
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;
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
function restartGame(scene) {
    musicaJuego.stop();
    escenaJoc.scene.start('escenaFinal');
    // escenaJoc.scene.start('escenaJoc');
}



function createLava() {
    // Crea la lava como un sprite utilizando un spritesheet
    lava = this.add.sprite(550, config.height - 70, 'lava').setScale(4).setDepth(10);
    lava2 = this.add.rectangle(550, config.height - 2, config.width, -40, "0xff1e04").setDepth(9);

    // lava.setOrigin(0, 1);
    this.physics.add.existing(lava, true);

    // Establece la animación de subida de la lava
    this.anims.create({
        key: 'lavaRise',
        frames: this.anims.generateFrameNumbers('lava', { start: 0, end: 8 }),
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
        lava.y -= lavaSpeed;

    }
}

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
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [escenaComienzo, escenaJoc, escenaFinal, escenaGanar]
};
var game = new Phaser.Game(config);