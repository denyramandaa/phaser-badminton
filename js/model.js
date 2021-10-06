class Model {
    constructor() {
        this.score = 0;
        this.respawnSpeed = 2000
        this.scoreAll = []
        this.roundNumber = 1
        
        this._musicOn = true;
        this._sfxOn = true;
        this.gameTitle="Latihan\nBulu Tangkis";
        this.instructionText="Instructions Here";
    }
    set musicOn(val) {
        this._musicOn = val;
        mt.emitter.emit(mt.constants.MUSIC_CHANGED);
    }
    get musicOn() {
        return this._musicOn;
    }
    set sfxOn(val) {
        this._sfxOn = val;
        mt.emitter.emit(mt.constants.SOUND_CHANGED);
    }
    get sfxOn() {
        return this._sfxOn;
    }
}