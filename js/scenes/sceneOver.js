class SceneOver extends Phaser.Scene {
    constructor() {
        super('SceneOver');
    }
    preload() {}
    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });      
    }
    create() {

        this.GetValue = Phaser.Utils.Objects.GetValue

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
        
       this.titleText = this.add.text(0, 0, "Game Over", {
            fontSize: game.config.width / 10,
            color: "#000",
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Anton'
        });
        this.titleText.setOrigin(0.5,0.5)
        this.aGrid.placeAtIndex(16, this.titleText);

        const _self = this
        var gridTable = this.rexUI.add.gridTable({
            x: 0,
            y: 0,
            width: game.config.width/1.5,
            height: game.config.height/2,
            scrollMode: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x4e342e),
            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            table: {
                cellWidth: undefined,
                cellHeight: 30,

                columns: 1,

                mask: {
                    padding: 2,
                },

                reuseCellContainer: true,
            },

            header: this.createRowItem(this,
                {
                    background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, 0x260e04),
                    set: this.add.text(0, 0, 'Set', {align: 'center'}),
                    skor: this.add.text(0, 0, 'Skor', {align: 'center'}),
                    durasi: this.add.text(0, 0, 'Durasi', {align: 'center'}),
                    height: 30
                }
            ),

            footer: null,

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    cellContainer = _self.createRowItem(scene);
                    console.log(cell.index + ': create new cell-container');
                } else {
                    console.log(cell.index + ': reuse cell-container');
                }

                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('set').setText(item.set);
                cellContainer.getElement('skor').setText(item.skor);
                cellContainer.getElement('durasi').setText(item.durasi);
                return cellContainer;
            },
            items: this.getItems()
        }).layout()
        gridTable.setOrigin(0.5,0)
        this.aGrid.placeAtIndex(60, gridTable);

        
        this.btnStart = new TextButton({
            scene: this,
            key: "gold",
            event: mt.constants.START_GAME,
            params: this.scene,
            text: "Main Lagi",
            scale: .35,
            textScale: 30,
            textColor: '#833400'
        });
        this.aGrid.placeAtIndex(102, this.btnStart);

        this.btnStart = new TextButton({
            scene: this,
            key: "gold",
            event: mt.constants.SHOW_TITLE,
            params: this.scene,
            text: "Menu",
            scale: .35,
            textScale: 30,
            textColor: '#833400'
        });
        this.aGrid.placeAtIndex(106, this.btnStart);
        
        mt.model.roundNumber=1
        mt.model.respawnSpeed = 2000
        mt.model.scoreAll = []
    }
    
    createRowItem(scene, config) {
        var background = this.GetValue(config, 'background', undefined);
        if (background === undefined) {
            background = this.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, 0x260e04)
        }
        var set = this.GetValue(config, 'set', undefined);
        if (set === undefined) {
            set = scene.add.text(0, 0, set);
        }
        var skor = this.GetValue(config, 'skor', undefined);
        if (skor === undefined) {
            skor = scene.add.text(0, 0, skor);
        }
        var durasi = this.GetValue(config, 'durasi', undefined);
        if (durasi === undefined) {
            durasi = scene.add.text(0, 0, durasi);
        }
        return this.rexUI.add.sizer({
            width: this.GetValue(config, 'width', undefined),
            height: this.GetValue(config, 'height', undefined),
            orientation: 'x',
        })
            .addBackground(
                background
            )
            .add(
                set,    // child
                0,                           // proportion, fixed width
                'center',                    // align vertically
                { left: 10 },                // padding
                false,                       // expand vertically
                'set'                         // map-key
            )
            .addSpace()
            .add(
                skor, // child
                0,                           // proportion, fixed width
                'center',                    // align vertically
                { left: 0 },               // padding
                false,                       // expand vertically
                'skor'                      // map-key
            )
            .addSpace()
            .add(
                durasi, // child
                0,                           // proportion, fixed width
                'center',                    // align vertically
                { right: 10 },               // padding
                false,                       // expand vertically
                'durasi'                      // map-key
            )
    }

    getItems() {
        var data = [];
        for(let i=0;i<mt.model.scoreAll.length;i++) {
            data.push({
                set: mt.model.scoreAll[i].round,
                skor: mt.model.scoreAll[i].player+"-"+mt.model.scoreAll[i].enemy,
                durasi: mt.model.scoreAll[i].time
            });
        }
        return data;
    }
}