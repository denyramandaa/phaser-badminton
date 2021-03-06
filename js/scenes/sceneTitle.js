class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    }
    preload() {
        
    }
    create() {
       
        this.back = this.add.image(0, 0, "titleBack");
        this.back.setOrigin(0, 0);
        this.back.displayWidth = game.config.width;
        this.back.displayHeight = game.config.height;
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
    //    this.aGrid.showNumbers();
       
        this.titleText = this.add.text(0, 0, mt.model.gameTitle, {
            fontSize: game.config.width / 10,
            color: "#000",
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Anton'
        });
        this.titleText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(27, this.titleText);
        
        this.btnStart = new TextButton({
            scene: this,
            key: "gold",
            event: mt.constants.START_GAME,
            params: this.scene,
            text: "Start Game",
            scale: .35,
            textScale: 30,
            textColor: '#833400'
        });
        this.aGrid.placeAtIndex(60, this.btnStart);
        
        this.btnInstr = new TextButton({
            scene: this,
            key: "gold",
            event: mt.constants.SHOW_INSTR,
            params: this.scene,
            text: "How to Play",
            scale: .35,
            textScale: 30,
            textColor: '#833400'
        });
        this.aGrid.placeAtIndex(49, this.btnInstr);
        this.btnSettings = new TextButton({
            scene: this,
            key: "gold",
            event: mt.constants.SHOW_SETTINGS,
            params: this.scene,
            text: "Settings",
            scale: .35,
            textScale: 30,
            textColor: '#833400'
        });
        this.aGrid.placeAtIndex(71, this.btnSettings);


    }
}