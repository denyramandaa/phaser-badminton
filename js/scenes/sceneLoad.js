class SceneLoad extends Phaser.Scene {
    constructor() {
        super('SceneLoad');
    }
    preload() {
        this.progText = this.add.text(0, 0, "0%", {
            color: '#ffffff',
            fontSize: game.config.width / 10
        });
        this.progText.setOrigin(0.5, 0.5);
        Align.center(this.progText);
        Effect.preload(this, 7);
        this.load.on('progress', this.showProgress, this);
        this.load.image("btnStart", "images/btnStart.png");
        this.load.image("titleBack", "images/titleBack.jpg");
        this.load.image("blue", "images/buttons/blue.png");
        this.load.image("red", "images/buttons/red.png");
        this.load.image("orange", "images/buttons/orange.png");
        this.load.image("green", "images/buttons/green.png");
        this.load.image("gold", "images/buttons/gold.png");
        this.load.image("sample", "images/sample.png");
        this.load.image("hitbutton", "images/buttons/hit.png");

        
        this.load.image("court", "images/court.jpg");
        this.load.image("shuttlecock", "images/shuttlecock.png");
        this.load.image("instruction", "images/instruction.jpg");
        this.load.spritesheet("player", "images/player.png", {frameWidth: 100, frameHeight:178});

        this.load.audio("hit", "audio/hit.mp3");
        this.load.audio("swing", "audio/swing.mp3");
        this.load.audio("serve", "audio/serve.mp3");
        this.load.audio("background", "audio/background.mp3");

        this.load.audio("win", "audio/win.mp3")
        this.load.audio("lose", "audio/lose.mp3")
    }
    create() {
        mt.emitter = new Phaser.Events.EventEmitter();
        mt.controller = new Controller();
        mt.mediaManager = new MediaManager({
            scene: this
        });
        this.scene.start("SceneTitle");
    }
    showProgress(prog) {
        var per = Math.floor((prog / 1) * 100);
        this.progText.setText(per + "%");
        
    }
    update() {}
}