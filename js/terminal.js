let canvas, ctx;
let terminalStr = '(Passkey) ~$ '
let currentEntry = '';
let textPosX, textPosY;
//get DPI
let dpi = window.devicePixelRatio;

function init () {
  	canvas = document.getElementById('terminal');
  	ctx = canvas.getContext('2d');
  	fix_dpi();
  	textPosX = 0;
  	textPosY = canvas.height - 3;
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

function writeText(text = '') {
  	ctx.save();
	ctx.fillStyle = 'white';
	// text specific styles
	ctx.font = '20px Inconsolata, monospace';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.shadowColor = "#000"
	ctx.shadowOffsetX = textPosX + 8;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 8;
	ctx.fillText(terminalStr + text, textPosX, textPosY);
	ctx.restore();
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  var inp = String.fromCharCode(event.keyCode);
  //key code is alphanumeric or hypen or underscore
  if (/[a-zA-Z0-9-_ ]/.test(inp)) {
  	currentEntry+= inp;
  	writeText(currentEntry);
  }
  if(event.keyCode === 8) {
  	if (currentEntry.length == 1) {
  	currentEntry = ""
  } else {
  currentEntry = currentEntry.slice(0,-1);
}
  	writeText(currentEntry);
  }
});