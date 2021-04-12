class LevelManager {
    constructor(levels) {
        this.levelChecker = levels.levelIds;
        this.levels = levels.levels;
        this.levelNumber = 0;
        this.currentLevel = this.levels[this.levelNumber];
    }
    
    advance = function(requestedLevel) {
        if (requestedLevel == "") {
            this.levelNumber ++;
        } else {
            if (this.checkLevel(requestedLevel) != undefined) {
                this.levelNumber = this.checkLevel(requestedLevel);
            } else {
                console.log("level does not exist");
            }
        }
        if ()
        this.currentLevel = this.levels[this.levelNumber];
    }
    
    checkLevel = function(levelToCheck) {
        if (this.levelChecker[levelToCheck] == null || this.levelChecker[levelToCheck] == undefined) {
            return "undefined";
        } else {
            return this.levelChecker[levelToCheck];
        }
    }
}