class LevelManager {
    constructor(levels) {
        this.levelChecker = levels.levelIds;
        this.levels = levels.levels;
        this.levelNumber = 0;
        this.currentLevel = this.levels[this.levelNumber];
        this.songs = levels.songs;
        currentSong = new Audio("sound/" + this.songs[this.levelNumber]);
    }
    
    advance = function(requestedLevel) {
        currentSong.pause();
        if (requestedLevel == "") {
            this.levelNumber = this.levelNumber + 1;
        } else {
            if (this.checkLevel(requestedLevel) == undefined) {
                console.log("level does not exist");
            } else {
                this.levelNumber = this.checkLevel(requestedLevel);
            }
        }
        console.log(this.levelNumber);
        currentSong = new Audio("sound/" + this.songs[this.levelNumber]);
        this.currentLevel = this.levels[this.levelNumber];
        currentSong.play();
    }
    
    checkLevel = function(levelToCheck) {
        if (this.levelChecker[levelToCheck] == undefined) {
            return undefined;
        } else {
            return this.levelChecker[levelToCheck];
        }
    }
    
    init = function() {
        this.advance("Menu");
        currentSong.addEventListener("ended", function() {
            this.currentTime = 0;
            this.play();
        }, false)
}
}