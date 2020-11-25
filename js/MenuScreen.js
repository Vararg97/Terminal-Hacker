class LoadMenu {
    
    constructor(picturePuzzleLocked, newperson) {
        this.picturePuzzleLocked = picturePuzzleLocked;
        this.newperson = newperson;        
        this.input = '';
		this.difficultyLevels = [
		  {name: 'EASY', value: 10},
		  {name: 'MEDIUM', value: 25},
		  {name: 'HARD', value: 50}
		];
		this.selectedDifficulty =  0;
		this.loadFailDiffSelect = false;
		this.onKeydown = null;
	}
	    
    init() {
    	this.onKeydown = this.setDifficulty.bind(this);
		document.addEventListener('keydown', this.onKeydown);
		this.drawLevelSelectText();
    }

	startGame(level) {
		this.selectedDifficulty = level;
		start();
	}

	drawLevelSelectText() {
		if(!this.loadFailDiffSelect) {
	    	writeTextAtLine('Please choose a difficulty level: EASY, MEDIUM or HARD', 1);
		} else {
		    writeTextAtLine('Not a valid Difficulty level.', 1);
		    writeTextAtLine('Please choose a difficulty level from: EASY, MEDIUM or HARD', 2);			
		}
	}

	setDifficulty(event) {
		if (event.isComposing || event.keyCode === 229) {
			return;
		}
		var inp = String.fromCharCode(event.keyCode);
		//key code is alphanumeric or hypen or underscore
		if (/[a-zA-Z0-9-_ ]/.test(inp)) {
			this.input += inp;
		}
		switch (event.keyCode) {
			case 8: 
				//Delete key pressed
			  	if(this.input.lenth <= 0) {
			  		this.input = '';
		  		} else {
		  			this.input = this.input.slice(0, -1);
		  		}
				break;
			case 13:
				//Enter key pressed
				let level = this.difficultyLevels.find(({name}) => { 
					return name === this.input
					});
				if(level) {
					document.removeEventListener('keydown', this.onKeydown);
					this.startGame(level.value);
				} else {
					this.loadFailDiffSelect = true;
					this.input = '';
					currentEntry = '';
					redraw(currentEntry);			
				}
				break;
		}		 					
	}    
}
