var canvasB;
var ctxB;
var widthB;
var heightB;

function initB() {
	canvasB = document.getElementById('bombPicture');
	ctxB = canvasB.getContext('2d');
	widthB = canvasB.width;
	heightB = canvasB.height;
}

function block(x, y) {
	this.x = x;
	this.y = y;
}

block.prototype.circle = function (x, y, radius, isFilled) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (isFilled == true) {
		ctx.fill();
	} else if (isFilled == false) {
		ctx.stroke();
	} else {
		alert('Function "circle" was called and returned with an error. Error explanation: The boolean argument at the 4th argument is not a boolean or was not valid in some way.');
	}
};

function bomb {
	this.bomb = new 
}

document.addEventListener('DOMContentLoaded', initB);