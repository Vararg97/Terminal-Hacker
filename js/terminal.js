let canvas, ctx, textPosX, textPosY, currentTextWidth, currentTextHeight, codeName;
let terminalStr = '(Passkey) ~$ '
let currentEntry = '';
let maxAttempts = 3;
let tries = maxAttempts;
let gameHasStarted = false;
let gameOver = false;
let menu;
let bomb;
let codeSynonyms;
let puzzleImage;
let stopped = false;

//get DPI
let dpi = window.devicePixelRatio;

function checkSynonyms(code) {
    let numberOfSynonyms = codeSynonyms.length;
    for (let i = 0; i < numberOfSynonyms; i++) {
        if (codeSynonyms[i].toUpperCase() == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}

function loadGameTwo() {
    
}

function init() {
  	canvas = document.getElementById('terminal');
  	ctx = canvas.getContext('2d');
  	fix_dpi(canvas);
  	textPosX = 0;
  	textPosY = canvas.height - 3;
  	loadMenu();
}

function loadMenu() {
  	//Load the first image/challenge
  	menu = new LoadMenu(false, true);
  	redraw();
  	menu.init();	
}

function restart() {
	tries = maxAttempts;	
	gameHasStarted = false;
	gameOver = false;
	currentEntry = '';
	puzzleImage = null;
	bomb = null;
	loadMenu();
}

function stop() {
	tries = maxAttempts;	
	gameHasStarted = false;
	gameOver = false;
	currentEntry = '';
	puzzleImage = null;
	bomb = null;
    stopped = true;
    redraw("Stopped VIA hotkey.");
}

function start() {
	gameHasStarted = true;
	currentEntry = '';
  	bomb = new Bomb(ctx, canvas.height, canvas.width, currentTextHeight);
    loadPuzzle(menu.selectedDifficulty, (bomb.startY - bomb.radius));
  	redraw(currentEntry);
}

function loadPuzzle(difficulty, height) {
	fetch("data/puzzles.json").then(response => response.json()).then(json => {
		let puzzle = json[Math.floor(Math.random() * (json.length))];
		codeName = puzzle.codeName;
        codeSynonyms = puzzle.synonyms;
		puzzleImage = new PuzzleImage(difficulty, canvas.width, height, "images/" + puzzle.image, ctx);
		puzzleImage.loadImage();
	});
}

//Thanks to https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da for solution
function fix_dpi(canvas) {
	//get CSS height
	//the + prefix casts it to an integer
	//the slice method gets rid of "px"
	let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	//get CSS width
	let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
	//scale the canvas
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);
}

function redraw(text) {
	fix_dpi(canvas);
  	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);   
	if(!gameHasStarted && !stopped) {
		menu.drawLevelSelectText();
	}
  	writeText(text);
  	if(puzzleImage) {
  		puzzleImage.drawPieces();
  	}
  	if(bomb) {
  		bomb.render(tries/maxAttempts);
  	}
	//ctx.restore();
}

function writeTextAtLine(text, lineNumber) {
    let lineOffset = 20;
    let lineStart = -5;
    lineStart = lineStart + (lineOffset * lineNumber);
    setupFont();
  	ctx.clearRect(0, lineStart, canvas.width, currentTextHeight);   
    writeText(text, 0, lineStart, false);
}

function setupFont() {
	ctx.fillStyle = 'white';
	// text specific styles
	ctx.font = '15pt Inconsolata, monospace';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.shadowColor = "#000"
	currentTextHeight = parseInt(ctx.font.match(/\d+/), 10);	
}

//Write our keyed in text onto the screen
function writeText(text = '', x = textPosX, y = textPosY, appendTerminalString = true) {
  	//Clear before redraw
  	setupFont();
	ctx.shadowOffsetX = x + 8;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 8;
	//Set the current values for the next path so we can clear before redraw
	currentTextWidth = ctx.measureText(terminalStr + text).width;
    let screenTxt = text;
    if(appendTerminalString) {
        screenTxt = terminalStr + text;
    }
	ctx.fillText(screenTxt, x, y);
}

function handleInput(event) {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  switch (event.keyCode) {
  	case 27: 
  		//Escape key pressed
  		restart();
        if (stopped) {
            stopped = false;
        }
  		break;
  	case 13: 
  		//Enter key pressed
  		if(gameHasStarted && !gameOver) {
  			checkCode();
  		}
  		break;
	case 8: 
		//Delete key pressed
		if(!gameOver) {
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
          stop();
          loadGameTwo();
          break;
	default: 
  		if(!gameOver) {
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

function youWin() {
	bomb.clearBomb();
    puzzleImage.drawFullImage();
    ctx.fillStyle = "gold";
    ctx.font = "60px Roboto";
    ctx.textAlign = "center";
    ctx.fillText("You Win!  Press the escape key to start over.",canvas.width/2,canvas.height/2);
}

//Check if we've submitted the correct code/passkey to win
function checkCode() {
	if(currentEntry.toUpperCase() === codeName.toUpperCase() || checkSynonyms(currentEntry)) {
		gameOver = true;
        youWin();
	} else {
		tries--;
		if(tries <= 0) {
			bomb.drawExplosion();
			tries = 0;
			gameOver = true;
		} else {
			currentEntry = '';
			redraw(currentEntry);
		} 
	}
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener("keydown", handleInput);
