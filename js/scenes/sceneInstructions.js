class SceneInstructions extends Phaser.Scene {
    constructor() {
        super('SceneInstructions');
    }
    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });  
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

       this.titleText = this.add.text(0, 0, "Cara Bermain", {
            fontSize: game.config.width / 10,
            color: "#fff",
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Anton'
        });
        this.titleText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(16, this.titleText);

        const content = `Gunakan tombol panah pada keyboard untuk menggerakan karakter dan tombol space untuk memukul bola.\n\nSetiap Set/Round terdapat 21 buah shuttlecock yang harus dipukul. Apabila shuttlecock yang dipukul lebih banyak daripada yang lewat, maka player akan dianggap menang. Begitu pula sebaliknya.\n\nSetelah menang 1 Set, maka player dapat melanjutkan ke set berikutnya. Semakin naik set semakin cepat bola yang akan datang.`;
        
        this.scrollablePanel = this.rexUI.add.scrollablePanel({
            x: 0,
            y: 0,
            width: game.config.width/1.2,
            height: game.config.height/3,

            scrollMode: 0,
            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),

            panel: {
                child: this.rexUI.add.fixWidthSizer({
                    space: {
                        left: 6,
                        right: 6,
                        top: 6,
                        bottom: 12,
                        item: 10,
                        line: 10,
                    }
                }),

                mask: {
                    padding: 1
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 8, 8, 2, 0x260e04),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 8, 0x7b5e57),
            },

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 20,
                panel: 20,
            }
        }).layout()
        this.aGrid.placeAtIndex(49, this.scrollablePanel);

        this.updatePanel(this.scrollablePanel, content);


        this.btnStart = new TextButton({
            scene: this,
            key: "gold",
            event: mt.constants.SHOW_TITLE,
            params:this.scene,
            text: "Menu",
            scale: .35,
            textScale: 25,
            textColor: '#833400'
        });
        this.aGrid.placeAtIndex(71,this.btnStart);

    }
    updatePanel(panel, content) {
        var sizer = panel.getElement('panel');
        var scene = panel.scene;
    
        sizer.clear(true);
        var lines = content.split('\n');
        for (var li = 0, lcnt = lines.length; li < lcnt; li++) {
            var words = lines[li].split(' ');
            for (var wi = 0, wcnt = words.length; wi < wcnt; wi++) {
                sizer.add(
                    scene.add.text(0, 0, words[wi], {
                        fontSize: 18
                    })
                );
            }
            if (li < (lcnt - 1)) {
                sizer.addNewLine();
            }
        }
    
    
        panel.layout();
        return panel;
    }
    update() {}
}