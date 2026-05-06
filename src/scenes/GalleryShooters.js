class GalleryShooters extends Phaser.Scene {
    constructor() {
        super('GalleryShooters'); 
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.bubbles = [];   
        this.maxBullets = 1;  

        this.bodyX = 400;
        this.bodyY = 550;
        this.duckY = 330;

        this.aKey = null;
        this.dKey = null;
        this.spaceKey = null;
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.atlasXML("duck", "spritesheet_objects.png", "spritesheet_objects.xml");
        this.load.atlasXML("Yellowduck", "spritesheet_objects.png", "spritesheet_objects.xml");
        this.load.atlasXML("Brownduck", "spritesheet_objects.png", "spritesheet_objects.xml");
        this.load.atlasXML("gun", "spritesheet_objects.png", "spritesheet_objects.xml");
        this.load.atlasXML("bullet", "spritesheet_hud.png", "spritesheet_hud.xml");
        this.load.atlasXML("crosshair", "spritesheet_hud.png", "spritesheet_hud.xml");
        this.load.atlasXML("curtain", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("Topcurtain", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("water1", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("water2", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("background", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("curtainRope", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("grass1", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("grass2", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("cloud1", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("cloud2", "spritesheet_stall.png", "spritesheet_stall.xml");
        this.load.atlasXML("bubble", "spritesheet.png", "spritesheet.xml");



        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.audio('bgMusic','Magic In The Garden.wav');

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

    }

    create(){
        let my = this.my;

        // Initial score and lives
        this.myScore = 0; 
        this.myLives = 3

        // Background
        my.sprite.background = this.add.sprite(400, 350, "background","bg_wood.png").setScale(3.25);

        // Water layer 2 (back)
        const water2Positions = [-380, -280, -150, -20, 110, 240, 370];
        my.sprite.water2 = water2Positions.map(offset =>
            this.add.sprite(this.bodyX + offset, this.bodyY - 125, "water2", "water2.png")
        );

        // straight-line path across the screen
        this.duckPath = new Phaser.Curves.Line(
            new Phaser.Math.Vector2(0, this.duckY),
            new Phaser.Math.Vector2(game.config.width, this.duckY)
        );

        // Create ducks as followers on the same path
        my.sprite.duck = this.add.follower(this.duckPath, 0, this.duckY, "duck", "duck_outline_white.png");
        my.sprite.Brownduck = this.add.follower(this.duckPath, 0, this.duckY, "Brownduck", "duck_outline_brown.png");
        my.sprite.Yellowduck = this.add.follower(this.duckPath, 0, this.duckY, "Yellowduck", "duck_outline_yellow.png");

        // Ducks worth
        my.sprite.duck.scorePoints = 100;
        my.sprite.Brownduck.scorePoints = 25;
        my.sprite.Yellowduck.scorePoints = 50;

        my.sprite.duck.isResetting = false;
        my.sprite.Brownduck.isResetting = false;
        my.sprite.Yellowduck.isResetting = false;

        // Water layer 1 (front)
        const water1Positions = [-350, -330, -200, -70, 60, 190, 320, 450];
        my.sprite.water1 = water1Positions.map(offset =>
            this.add.sprite(this.bodyX + offset, this.bodyY - 100, "water1", "water1.png")
        );

        // Grass layer 2 (back)
        const grass2Postions = [-380, -280, -150, -20, 110, 240, 370];
        my.sprite.grass2 = grass2Postions.map(offset =>
            this.add.sprite(this.bodyX + offset, this.bodyY - 25, "grass2", "grass2.png")
        );

        // Grass layers 1 (front)
        const grass1Postions = [-460, -330, -200, -70, 60, 190, 320, 450];
        my.sprite.grass1 = grass1Postions.map(offset =>
            this.add.sprite(this.bodyX + offset, this.bodyY, "grass1", "grass1.png")
        );

        // Side curtains
        my.sprite.curtain = [
            { x: this.bodyX - 340, flip: false },
            { x: this.bodyX + 350, flip: true },
        ].map(({ x, flip }) => {
            const c = this.add.sprite(x, this.bodyY - 285, "curtain", "curtain.png");
            c.flipX = flip;
            return c;
        });

        // Cloud
        my.sprite.cloud1 = this.add.sprite(this.bodyX + 200, this.bodyY - 450, "cloud1","cloud1.png");
        my.sprite.cloud2 = this.add.sprite(this.bodyX - 200, this.bodyY - 350, "cloud2","cloud2.png");

        // Curtain ropes
        my.sprite.curtainRope = [
            this.bodyX - 390,
            this.bodyY + 240,
        ].map(x =>
            this.add.sprite(x, this.bodyY - 285, "curtainRope", "curtain_rope.png")
        );

        // Top curtain
        my.sprite.Topcurtain = [-300, -44, 212, 468].map(offset =>
            this.add.sprite(this.bodyX + offset, this.bodyY - 510, "Topcurtain", "curtain_straight.png")
        );

        // Crosshair
        my.sprite.crosshair = this.add.sprite(this.bodyX - 50, this.duckY, "crosshair","crosshair_white_small.png");    

        // Gun
        my.sprite.gun = this.add.sprite(this.bodyX, this.bodyY, "gun","rifle.png").setScale(.75);
         
        // Keys
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Death animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,
            repeat: 1,
            hideOnComplete: true
        });

        // Speed of objects
        this.playerSpeed = 300;
        this.bulletSpeed = 300;
        this.bubbleSpeed = 200;

        // Text
        my.text.score = this.add.bitmapText(0, 0, "rocketSquare", "Score " + this.myScore);
        my.text.lives = this.add.bitmapText(600, 0, "rocketSquare", "Lives " + this.myLives);

        // Background music
        this.bgMusic  = this.sound.add('bgMusic', { 
            volume: 0.5,
            loop: true
        });
        this.bgMusic.play();

        const randomDuration = () => Phaser.Math.Between(2000, 5000);

        // Ducks start on the left most part of the screen and go in a straight line
        this.startDuck = (duck) => {
            duck.visible = false;
            duck.x = 0;     
            duck.y = this.duckY;

            duck.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: randomDuration(),
                ease: 'Linear',
                repeat: 0,
                onStart: () => {
                    duck.visible = true
                },

                onComplete: () => {
                    this.startDuck(duck); 
                }
            });
        };

        this.startDuck(my.sprite.duck);
        this.startDuck(my.sprite.Brownduck);
        this.startDuck(my.sprite.Yellowduck);

        // Each duck randomly fires a bubble
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                const ducks = [my.sprite.duck, my.sprite.Brownduck, my.sprite.Yellowduck];
                const activeDucks = ducks.filter(d => d.visible && !d.isResetting);
                if (activeDucks.length > 0) {
                    const shooter = Phaser.Utils.Array.GetRandom(activeDucks);
                    my.sprite.bubbles.push(
                        this.add.sprite(shooter.x, shooter.y, "bubble", "bubble_a")
                    );
                }
            }
        });
    }

    update(time, delta){
        let my = this.my;
        let dt = delta / 1000;

        // Move Right
        if(this.aKey.isDown){
            if (my.sprite.gun.x > (my.sprite.gun.displayWidth/2)) {
                my.sprite.gun.x -= this.playerSpeed * dt;
                my.sprite.crosshair.x -= this.playerSpeed * dt;
            }
        }
  
        // Move Left
        if(this.dKey.isDown){
            if (my.sprite.gun.x < (game.config.width - (my.sprite.gun.displayWidth/2))) {
                my.sprite.gun.x += this.playerSpeed * dt;
                my.sprite.crosshair.x += this.playerSpeed * dt;
            }
        }    

        // Shoots bullet
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.gun.x - 50, my.sprite.gun.y -  (my.sprite.gun.displayHeight/2), "bullet", "icon_bullet_silver_long.png")
                );
            }
        }

        // Bullet is destroyed once it goes off the screen
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => {
            if (bullet.y <= -(bullet.displayHeight / 2)) {
                bullet.destroy();
                return false;
            }
            return true;
        });

        // If duck it hit
        for (let bullet of my.sprite.bullet) {
            let bulletHit = false;
            for (let duck of [my.sprite.duck, my.sprite.Brownduck, my.sprite.Yellowduck]) {
                if (bulletHit) break;
                    if (duck.visible && !duck.isResetting && this.collides(duck, bullet)) {
                        const puff = this.add.sprite(duck.x, duck.y, "whitePuff03").setScale(0.25).play("puff");
                        bullet.y = -100;
                        bulletHit = true;
                        duck.isResetting = true;
                        duck.stopFollow();    
                        duck.visible = false;
                        this.myScore += duck.scorePoints;
                        this.updateScore();

                        // Once animation is complete reset duck
                        puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            duck.visible = true;
                            duck.isResetting = false;
                            this.startDuck(duck); 
                        }, this);
                    }
            }
        }

        // Moves bullet upwards
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;

        }

        // Move bubbles downward 
        my.sprite.bubbles = my.sprite.bubbles.filter((bubble) => {
            bubble.y += this.bubbleSpeed * dt;

            // Bubble is destroyed once off screen
            if (bubble.y > game.config.height + bubble.displayHeight) {
                bubble.destroy();
                return false;
            }

            // If bubble hits gun a life is lost
            if (this.collides(bubble, my.sprite.gun)) {
                bubble.destroy();
                this.myLives--;
                my.text.lives.setText("Lives " + this.myLives);

                // Once all lives are lost switch to game over screen
                if (this.myLives <= 0) {
                    this.bgMusic.stop();
                    this.scene.start('GameOver'); 
                }
                return false;
            }

            return true;
        });

        // Gets harder the higher the score gets
        if(this.myScore >= 7500){
            this.playerSpeed = 300;
            this.bulletSpeed = 500;
            this.bubbleSpeed = 350;
        } else if(this.myScore >= 2500) {
            this.playerSpeed = 300;
            this.bulletSpeed = 500;
            this.bubbleSpeed = 275;
        } else {
            this.playerSpeed = 300;
            this.bulletSpeed = 500;
            this.bubbleSpeed = 200;
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
}
