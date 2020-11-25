class Bomb {
	constructor(ctx, height, width, textLocationY) {
		this.ctx = ctx;
		this.height = height;
		this.width = width;

		this.radius = 15;
		this.startX = width / 4;
		this.startY = this.height - (textLocationY + this.radius + 5);
		this.fuseEndpoint;
	}

	render = function(fuseLength) {
		this.drawBomb();
		this.drawFuse(fuseLength);
		this.drawSpark();
	}

	drawBomb = function() {
		this.ctx.beginPath();
		this.ctx.arc(this.startX , this.startY, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = 'black';		
		this.ctx.fill();
	}

	drawFuse = function(segment) {
        this.ctx.beginPath();
        let startPoint = this.startX + this.radius;
        let endPoint = (this.width - (this.startX - this.radius));
        let maxFuseLength = endPoint - startPoint;
        let segmentOffset = maxFuseLength * segment;
       	this.fuseEndpoint = startPoint + segmentOffset;
        this.ctx.moveTo(startPoint, this.startY);
        this.ctx.bezierCurveTo(startPoint + 10, this.startY - 20, this.fuseEndpoint - 20, this.height, this.fuseEndpoint, this.startY);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
	}

	drawSpark = function() {
		//Thank you to https://riptutorial.com/html5-canvas/example/18135/stars for help with this
	    let rot = Math.PI / 2 * 3;
	    let x = this.fuseEndpoint;
	    let y = this.startY;
	    let step = Math.PI / 12;
	    let outerRadius = 5;
	    let innerRadius = 3;

	    this.ctx.strokeSyle = "#000";
	    this.ctx.beginPath();
	    this.ctx.moveTo(this.fuseEndpoint, this.startY - outerRadius)
	    for (let i = 0; i < 12; i++) {
	        x = this.fuseEndpoint + Math.cos(rot) * outerRadius;
	        y = this.startY + Math.sin(rot) * outerRadius;
	        ctx.lineTo(x, y)
	        rot += step

	        x = this.fuseEndpoint + Math.cos(rot) * innerRadius;
	        y = this.startY + Math.sin(rot) * innerRadius;
	        ctx.lineTo(x, y)
	        rot += step
	    }
	    ctx.lineTo(this.fuseEndpoint, this.startY - outerRadius)
	    ctx.closePath();
	    ctx.lineWidth=5;
	    ctx.strokeStyle='DarkRed';
	    ctx.stroke();
	    ctx.fillStyle='FireBrick';
	    ctx.fill();
	}

	drawExplosion = function() {
		
	}
}