let canvas, ctx, textPosX, textPosY, currentTextWidth, currentTextHeight;
let terminalStr = '(Passkey) ~$ '
let currentEntry = '';
let menu;
let bomb;
let puzzleImage;
let trivia;
let gameEngine;

const gameStates = {
	INIT:"init",
	STARTED:"started",
	GAMEOVER:"gameover",
	STAGE1:"stage1",
	STAGE2:"stage2"
}

//get DPI
let dpi = window.devicePixelRatio;

function init() {
  	canvas = document.getElementById('terminal');
  	ctx = canvas.getContext('2d');
  	fix_dpi(canvas);
  	textPosX = 0;
  	textPosY = canvas.height - 3;
  	gameEngine = new GameEngine();
  	gameEngine.init();
  	loadMenu();
}

function loadMenu() {
  	//Load the first image/challenge
  	menu = new LoadMenu(false, true, gameEngine);
  	redraw();
  	menu.init();
}

function cleanGlobals() {
	puzzleImage = null;
	trivia = null;
	currentEntry = '';
}		

function loadPuzzle(difficulty, height) {
	fetch("data/puzzles.json").then(response => response.json()).then(json => {
		let puzzle = json[Math.floor(Math.random() * (json.length))];
		puzzleImage = new PuzzleImage(difficulty, canvas.width, height, "images/" + puzzle.image, ctx, puzzle.codeName, puzzle.synonyms);
		puzzleImage.loadImage();
	});
}

function loadTrivia() {
	fetch("data/questions.json").then(response => response.json()).then(json => {
		let question = json[Math.floor(Math.random() * (json.length))];
		trivia = new Trivia(question);
		trivia.init();
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
	if([gameStates.INIT, gameStates.STARTED].indexOf(gameEngine.getGameState()) > -1) {
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


document.addEventListener('DOMContentLoaded', init);
