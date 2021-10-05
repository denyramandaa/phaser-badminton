class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        
    }
    create() {
        mt.mediaManager.setBackground("background")
        this.shuttlecockCounter = 0
        this.playerScore = 0
        this.enemyScore = 0
        this.hitStatus = false
        this.gameIsDone = false
        this.showDone = false
        this.holdHitPoint = false
        this.maxCounter = 10
        this.timer = 0


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
       this.time.addEvent({ delay: mt.model.respawnSpeed, callback: this.createShuttleCock, callbackScope: this, loop: true });
       this.timerWrap = this.time.addEvent({ delay: 1000, callback: this.timerCount, callbackScope: this, loop: true });


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
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.overlap(this.player, this.shuttlecockGroup, this.hitBall, null, this)

        this.scoreText=this.add.text(0,0,"Score: 0 - 0")
        this.scoreText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(8, this.scoreText)

        this.timerText=this.add.text(0,0,"Timer: 0")
        this.timerText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(2, this.timerText)
    }
    timerCount() {
        this.timer+=1
        this.timerText.setText("Timer: "+this.timer)
        if(this.showDone) {
            this.timerWrap.remove()
        }
    }
    hitBall(player, ball) {
        if(this.hitStatus && this.holdHitPoint) {
            mt.mediaManager.playSound("hit")
            ball.setVelocityY(-100)
            ball.angle = 180
            const _self = this
            setTimeout(function() {
                if(ball) { 
                    ball.destroy()
                    _self.playerScore+=1
                    _self.updateText()
                }
            },1000)
        }
    }
    updateText() {
        this.scoreText.setText("Score: "+this.playerScore + " - " + this.enemyScore)
    }
    createShuttleCock() {
        if(this.gameIsDone) return
        const xx=game.config.width/2
        const yy=0

        let shuttlecock = this.physics.add.sprite(0,0,"shuttlecock")
        this.shuttlecockGroup.add(shuttlecock)
        shuttlecock.x = xx
        shuttlecock.y = yy
        
        Align.scaleToGameW(shuttlecock, .025);
        mt.mediaManager.playSound("serve")

        const randVelo = Phaser.Math.Between(100, 200)
        shuttlecock.setVelocityY(randVelo)
        const randX = Phaser.Math.Between(game.config.width/5,game.config.width/1.25)
        this.tweens.add({targets: shuttlecock,duration: 5000,x:randX});
        this.shuttlecockCounter++
    }
    statusHitToFalse() {
        this.hitStatus = false
    }
    update() {
        if (this.cursors.left.isDown && !this.showDone)
        {
            if(this.player.x <= game.config.width/5) return
            this.player.x-=4;
        }
        else if (this.cursors.right.isDown && !this.showDone)
        {
            if(this.player.x >= game.config.width/1.25) return
            this.player.x+=4;
        }
        else if (this.cursors.up.isDown && !this.showDone)
        {
            if(this.player.y <= game.config.height/2.5) return
            this.player.y-=2;
        }
        else if (this.cursors.down.isDown && !this.showDone)
        {
            if(this.player.y >= game.config.height/1.3) return
            this.player.y+=2;
        }

        if (this.keySpace.isDown && !this.showDone)
        {
            if(!this.holdHitPoint) {
                this.hitStatus = true
                this.holdHitPoint = true
                this.player.play('hit', true);
                mt.mediaManager.playSound("swing")
                this.player.on('animationcomplete', this.statusHitToFalse);
            } else {
                this.hitStatus = false
            }
        } else if(this.keySpace.isUp) {
            this.holdHitPoint = false
        }

        this.shuttlecockGroup.children.iterate(function(child) {
            if(child) {
                if(child.y>game.config.height) {
                    child.destroy()
                    this.enemyScore+=1
                    this.updateText()
                }
            }
        }.bind(this))

        if(this.shuttlecockCounter >= this.maxCounter && !this.gameIsDone) {
            // if(this.playerScore-this.enemyScore != 1 || this.playerScore-this.enemyScore != -1) 
            this.gameIsDone = true
        }
        if(this.shuttlecockGroup.children.entries.length===0 && !this.showDone) {
            this.showDone = true
            if(this.playerScore>this.enemyScore) {
                console.log('WIN!')
            } else {
                console.log('LOSE!')
            }
        }
    }
}