let canvas, ctx;
let terminalStr = '(Passkey) ~$ '
let textPosX, textPosY;
//get DPI
let dpi = window.devicePixelRatio;

function init () {
  	canvas = document.getElementById('terminal');
  	ctx = canvas.getContext('2d');
  	fix_dpi();
  	textPosX = 0;
  	textPosY = canvas.height - 3;
  	ctx.save();
	ctx.fillStyle = 'white';
	// text specific styles
	ctx.font = '20px Inconsolata, monospace';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText(terminalStr, textPosX, textPosY);
	ctx.restore();
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

document.addEventListener('DOMContentLoaded', init);