class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        
    }
    create() {
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

       this.shuttlecock = this.add.image(0,0,"shuttlecock")
       Align.scaleToGameW(this.shuttlecock, .025);
       this.aGrid.placeAtIndex(16, this.shuttlecock);


       this.player = this.add.sprite(0,0,"player")
       this.player.setOrigin(0.5, 0.5);
       Align.scaleToGameW(this.player, .15);
       this.aGrid.placeAtIndex(71, this.player);

       this.anims.create({
            key: 'hit',
            frames: [
                { key: 'player',frame:0 },
                { key: 'player',frame:1 },
            ],
            frameRate: 8,
            repeat: -1
        });
        this.player.play('hit');

        this.cursors = game.input.keyboard.createCursorKeys();
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
    }
}