let canvas, ctx, textPosX, textPosY, currentTextWidth, currentTextHeight, codeName;
let terminalStr = '(Passkey) ~$ '
let currentEntry = '';
const DIFFICULTY = 50;
let puzzleImage;
let tries = 3;

//get DPI
let dpi = window.devicePixelRatio;

function init () {
  	canvas = document.getElementById('terminal');
  	ctx = canvas.getContext('2d');
  	fix_dpi();
  	textPosX = 0;
  	textPosY = canvas.height - 3;
  	//Load the first image/challenge
  	redraw();
  	loadPuzzle();
}

function loadPuzzle() {
	fetch("data/puzzles.json").then(response => response.json()).then(json => {
		let puzzle = json[Math.floor(Math.random() * (json.length))];
		codeName = puzzle.codeName;
		puzzleImage = new PuzzleImage(DIFFICULTY, canvas.width, canvas.height - (currentTextHeight + 5), "images/" + puzzle.image, ctx);
		puzzleImage.loadImage();
	});
}

//Thanks to https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da for solution
function fix_dpi() {
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
	fix_dpi();
  	ctx.save();
  	ctx.clearRect(0, 0, canvas.width, canvas.height);   
  	writeText(text);
  	if(puzzleImage) {
  		puzzleImage.drawPieces();
  	}
	//ctx.restore();
}

//Write our keyed in text onto the screen
function writeText(text = '') {
  	//Clear before redraw
	ctx.fillStyle = 'white';
	// text specific styles
	ctx.font = '15pt Inconsolata, monospace';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.shadowColor = "#000"
	ctx.shadowOffsetX = textPosX + 8;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 8;
	//Set the current values for the next path so we can clear before redraw
	currentTextWidth = ctx.measureText(terminalStr + text).width;
	currentTextHeight = parseInt(ctx.font.match(/\d+/), 10);
	ctx.fillText(terminalStr + text, textPosX, textPosY);
}

function handleKeydown(event) {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  var inp = String.fromCharCode(event.keyCode);
  //key code is alphanumeric or hypen or underscore
  if (/[a-zA-Z0-9-_ ]/.test(inp)) {
  	currentEntry+= inp;
  	redraw(currentEntry);
  }
  switch (event.keyCode) {
  	case 27: 
  		//Escape key pressed
  		break;
  	case 13:
  		//Enter key pressed
  		checkCode();
  		break;
	case 8: 
		//Delete key pressed
	  	if(currentEntry.lenth <= 0) {
	  		currentEntry = '';
  		} else {
  			currentEntry = currentEntry.slice(0, -1);
  		}
  		redraw(currentEntry);
		break;
  }	
}

//Check if we've submitted the correct code/passkey to win
function checkCode() {
	if(currentEntry.toUpperCase() === codeName.toUpperCase()) {
		alert("YOU WIN!");
		currentEntry = '';
		tries = 3;
	} else {
		tries--;
		if(tries <= 0) {
			alert("You Failed!");
			tries = 3;
			currentEntry = '';
			redraw(currentEntry);
		} else {
			alert("Try Again. You have " + tries + " tries remaining.");
			currentEntry = '';
			redraw(currentEntry);
		} 
	}
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener("keydown", handleKeydown);
