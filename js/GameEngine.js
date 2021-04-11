class GameEngine {
	constructor() {
		this.gameState = gameStates.INIT;
		this.bomb;
		this.maxAttempts = 3;
		this.tries = this.maxAttempts;
	}

	setGameState = function(state) {
		this.gameState = state;
	}

	getGameState = function() {
		return this.gameState;
	}

	restart = function() {
		this.clearState();
		menu = null;
		loadMenu();
	}

	start = function() {
		this.clearState();
		this.setGameState(gameStates.STARTED);
	  	this.bomb = new Bomb(ctx, canvas.height, canvas.width, currentTextHeight);
	  	this.gameState = gameStates.STAGE1;
	  	this.loadStage();
	}

	loadStage = function() {
		switch (this.gameState) {
			case gameStates.STAGE1:
				loadPuzzle(menu.selectedDifficulty, (this.bomb.startY - this.bomb.radius));
				redraw(currentEntry);
				break;
			case gameStates.STAGE2:
				this.clearState();
				redraw(currentEntry);
				break;
		}
	}

	clearState = function() {
		currentEntry = '';
		this.tries = this.maxAttempts;
		this.setGameState(gameStates.INIT);
		puzzleImage = null;
		this.bomb = null;
	}

	youWin = function() {
		this.bomb.clearBomb();
	    puzzleImage.drawFullImage();
	    ctx.fillStyle = "gold";
	    ctx.font = "60px Roboto";
	    ctx.textAlign = "center";
	    ctx.fillText("You Win!  Press the escape key to start over.",canvas.width/2,canvas.height/2);
	}

	//Check if we've submitted the correct code/passkey to win
	checkCode = function() {
		let correct = false;
		switch (this.gameState) {
			case gameStates.STAGE1:
				correct = puzzleImage.isCorrect(currentEntry);
				break;
		}
		if(correct) {
			this.gameState = gameStates.GAMEOVER;
			this.youWin();
		} else {
			this.tries--;
			if(this.tries <= 0) {
				this.bomb.drawExplosion();
				this.tries = 0;
				this.gameState = gameStates.GAMEOVER;
			} else {
				currentEntry = '';
				redraw(currentEntry);
			} 
		}
	}

	gameLoop = function(event) {
	  if (event.isComposing || event.keyCode === 229) {
	    return;
	  }
	  switch (event.keyCode) {
	  	case 27: 
	  		//Escape key pressed
	  		this.restart();
	  		break;
	  	case 13: 
	  		//Enter key pressed
	  		if([gameStates.STARTED, gameStates.STAGE1, gameStates.STAGE2].indexOf(this.gameState) > -1)  {
	  			this.checkCode();
	  		}
	  		break;
		case 8: 
			//Delete key pressed
			if(this.gameState != gameStates.GAMEOVER) {
			  	if(currentEntry.lenth <= 0) {
			  		currentEntry = '';
		  		} else {
		  			currentEntry = currentEntry.slice(0, -1);
		  		}
		  		redraw(currentEntry);
	  		}
			break;
	      case 187:
	          //Equals symbol key pressed
	          this.gameState = gameStates.STAGE2;
	          this.loadStage();
	          break;
	       case 61:
	          //Equals symbol key pressed
	          this.gameState = gameStates.STAGE2;
	          this.loadStage();
	          break;
		default: 
	  		if([gameStates.STARTED, gameStates.INIT, gameStates.STAGE1, gameStates.STAGE2].indexOf(this.gameState) > -1)  {
			  var inp = String.fromCharCode(event.keyCode);
			  //key code is alphanumeric or hypen or underscore
			  if (/[a-zA-Z0-9-_ ]/.test(inp)) {
			  	currentEntry+= inp;
			  	redraw(currentEntry);
			  }
			}
		  break;
	  }	
	}

	init = function() {
		document.addEventListener("keydown", function(e) {
			this.gameLoop(e)}.bind(this));
	}
}