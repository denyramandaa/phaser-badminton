class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        
    }
    create() {
        this.hitStatus = false
        this.back = this.add.image(0, 0, "court");
        this.back.setOrigin(0, 0);
        this.back.displayWidth = game.config.width;
        this.back.displayHeight = game.config.height;
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
    //    this.aGrid.showNumbers();

       this.shuttlecockGroup = this.physics.add.group()

       this.createShuttleCock()
       this.time.addEvent({ delay: 2000, callback: this.createShuttleCock, callbackScope: this, loop: true });


       this.player = this.physics.add.sprite(0,0,"player")
       this.player.setImmovable()
       this.player.setOrigin(0.5, 0.5);
       Align.scaleToGameW(this.player, .15);
       this.aGrid.placeAtIndex(71, this.player);

       this.anims.create({
            key: 'hit',
            frames: [
                { key: 'player',frame:0 },
                { key: 'player',frame:1 },
                { key: 'player',frame:0 },
            ],
            frameRate: 8,
            repeat: 0
        });

        this.cursors = game.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.player, this.shuttlecockGroup, this.hitBall, null, this)

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    hitBall(player, ball) {
        if(this.hitStatus) {
            ball.setVelocityY(-100)
            ball.angle = 180
        }
    }
    stopHit() {
        this.player.animations.stop(null)
    }
    createShuttleCock() {
        const xx=game.config.width/2
        const yy=0

        let shuttlecock = this.physics.add.sprite(0,0,"shuttlecock")
        this.shuttlecockGroup.add(shuttlecock)
        shuttlecock.x = xx
        shuttlecock.y = yy
        
        Align.scaleToGameW(shuttlecock, .025);

        shuttlecock.setVelocityY(100)
        const randX = Phaser.Math.Between(game.config.width/5,game.config.width/1.25)
        this.tweens.add({targets: shuttlecock,duration: 5000,x:randX});
    }
    statusHitToFalse() {
        this.hitStatus = false
    }
    update() {
        if (this.cursors.left.isDown)
        {
            if(this.player.x <= game.config.width/5) return
            this.player.x-=4;
        }
        else if (this.cursors.right.isDown)
        {
            if(this.player.x >= game.config.width/1.25) return
            this.player.x+=4;
        }
        else if (this.cursors.up.isDown)
        {
            if(this.player.y <= game.config.height/2.5) return
            this.player.y-=2;
        }
        else if (this.cursors.down.isDown)
        {
            if(this.player.y >= game.config.height/1.3) return
            this.player.y+=2;
        }

        if (this.keySpace.isDown)
        {
            if(this.hitStatus) return
            this.hitStatus = true
            this.player.play('hit', true);
            this.time.addEvent({ delay: 500, callback: this.statusHitToFalse, callbackScope: this, loop: false });
        }

        this.shuttlecockGroup.children.iterate(function(child) {
            if(child) {
                if(child.y>game.config.height || child.y<-100) {
                    child.destroy()
                }
            }
        }.bind(this))
    }
}