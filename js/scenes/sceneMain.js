class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);
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
        this.maxCounter = 21
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

        this.shuttlecockLeftText=this.add.text(0,0,"Counter: "+this.maxCounter)
        this.shuttlecockLeftText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(8, this.shuttlecockLeftText)

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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.overlap(this.player, this.shuttlecockGroup, this.hitBall, null, this)

        this.timerText=this.add.text(0,0,"Timer: 0")
        this.timerText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(2, this.timerText)

        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 0,
            y: 0,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 25, 0xcccccc),
            // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        })
        .on('update', this.dumpJoyStickState, this);
        
        this.aGrid.placeAtIndex(101, this.joyStick)
        if(isMobile == -1) this.joyStick.visible  = false

        this.text = this.add.text(0, 0);
        this.dumpJoyStickState();

        this.hitbutton = this.add.image(0,0,"hitbutton")
        this.hitbutton.setOrigin(0.5, 0.5);
        Align.scaleToGameW(this.hitbutton, .15);
        this.aGrid.placeAtIndex(107, this.hitbutton);
        this.hitbutton.setInteractive();
        this.hitbutton.on('pointerdown', this.hitting, this);
        this.hitbutton.on('pointerup', this.releasehitting, this);
        if(isMobile == -1) this.hitbutton.visible  = false
    }
    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        for (var dir in cursorKeys) {
            if (cursorKeys[dir].isDown) {
                switch(dir) {
                    case 'up' :
                        if(this.player.y >= game.config.height/2.2) this.player.y-=4;
                    break;
                    case 'down' :
                        if(this.player.y <= game.config.height/1.3) this.player.y+=4;
                    break;
                    case 'left' :
                        if(this.player.x >= game.config.width/5) this.player.x-=4;
                    break;
                    case 'right' :
                        if(this.player.x <= game.config.width/1.25) this.player.x+=4;
                    break;
                }
            }
        }
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
            ball.setVelocityY(-150)
            ball.angle = 180
            setTimeout(function() {
                if(ball) { 
                    ball.destroy()
                }
            },1000)
        }
    }
    updateText(con) {
        this.shuttlecockLeftText.setText("Counter: "+con)
    }
    createShuttleCock() {
        if(this.gameIsDone) return
        this.shuttlecockCounter++
        const xx=game.config.width/2
        const yy=0

        
        const leftSc = this.maxCounter - this.shuttlecockCounter
        this.updateText(leftSc)

        let shuttlecock = this.physics.add.sprite(0,0,"shuttlecock")
        this.shuttlecockGroup.add(shuttlecock)
        shuttlecock.x = xx
        shuttlecock.y = yy
        
        Align.scaleToGameW(shuttlecock, .025);
        mt.mediaManager.playSound("serve")

        const randVelo = Phaser.Math.Between(160, 250)
        shuttlecock.setVelocityY(randVelo)
        const randX = Phaser.Math.Between(game.config.width/4,game.config.width/1.1)
        this.tweens.add({targets: shuttlecock,duration:2000,x:randX});
    }
    statusHitToFalse() {
        this.hitStatus = false
    }
    hitting() {
        if(!this.holdHitPoint) {
            this.hitStatus = true
            this.holdHitPoint = true
            this.player.play('hit', true);
            mt.mediaManager.playSound("swing")
            this.player.on('animationcomplete', this.statusHitToFalse);
        } else {
            this.hitStatus = false
        }
    }
    releasehitting() {
        this.holdHitPoint = false
    }
    update() {
        if (this.cursors.left.isDown && !this.showDone)
        {
            if(this.player.x <= game.config.width/5) return
            this.player.x-=3;
        }
        else if (this.cursors.right.isDown && !this.showDone)
        {
            if(this.player.x >= game.config.width/1.25) return
            this.player.x+=3;
        }
        else if (this.cursors.up.isDown && !this.showDone)
        {
            if(this.player.y <= game.config.height/2.2) return
            this.player.y-=3;
        }
        else if (this.cursors.down.isDown && !this.showDone)
        {
            if(this.player.y >= game.config.height/1.3) return
            this.player.y+=3;
        }

        if (this.keySpace.isDown && !this.showDone)
        {
            this.hitting()
        } else if(this.keySpace.isUp) {
            this.releasehitting()
        }

        this.shuttlecockGroup.children.iterate(function(child) {
            if(child) {
                if(child.y>game.config.height) {
                    child.destroy()
                    this.enemyScore+=1
                }
            }
        }.bind(this))

        if(this.shuttlecockCounter >= this.maxCounter && !this.gameIsDone) {
            // if(this.playerScore-this.enemyScore != 1 || this.playerScore-this.enemyScore != -1) 
            this.gameIsDone = true
        }
        if(this.shuttlecockGroup.children.entries.length===0 && !this.showDone) {
            this.showDone = true
            mt.mediaManager.stopMusic()
            this.playerScore = this.maxCounter - this.enemyScore
            const obj = {
                "round" : mt.model.roundNumber,
                "player" : this.playerScore,
                "enemy" : this.enemyScore,
                "time" : this.timer
            }
            mt.model.scoreAll.unshift(obj)
            if(this.playerScore>this.enemyScore) {
                if(mt.model.respawnSpeed<=500) {
                    if(mt.model.respawnSpeed==100) {
                        mt.model.respawnSpeed=100
                    } else {
                        mt.model.respawnSpeed-=100
                    }
                } else {
                    mt.model.respawnSpeed-=500
                }
                mt.model.roundNumber+=1
                this.scene.start("SceneSummary")
                mt.mediaManager.playSound("win")
            } else {
                this.scene.start("SceneOver")
                mt.mediaManager.playSound("lose")
            }
        }
    }
}