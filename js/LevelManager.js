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
            if (this.checkLevel(requestedLevel) == undefined) {
                console.log("level does not exist");
            } else {
                this.levelNumber = this.checkLevel(requestedLevel);
            }
        }
        this.currentLevel = this.levels[this.levelNumber];
    }
    
    checkLevel = function(levelToCheck) {
        if (this.levelChecker[levelToCheck] == undefined) {
            return undefined;
        } else {
            return this.levelChecker[levelToCheck];
        }
    }
}