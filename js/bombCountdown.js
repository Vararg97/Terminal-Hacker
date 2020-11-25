class Bomb {
	constructor(ctx, height, width, textLocationY) {
		this.ctx = ctx;
		this.height = height;
		this.width = width;

		this.radius = 15;
		this.startX = width / 4;
		this.startY = this.height - (textLocationY + this.radius + 5);
		this.fuseEndpoint;

		this.explosionInterval = null;
		this.explosionCycle = 1;
	}

	render = function(fuseLength) {
		this.drawBomb();
		this.drawFuse(fuseLength);
		this.drawSpark(this.fuseEndpoint, this.startY, 5, 3);
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

	drawSpark = function(cx, cy, outerRadius, innerRadius) {
		//Thank you to https://riptutorial.com/html5-canvas/example/18135/stars for help with this
	    let rot = Math.PI / 2 * 3;
	    let x = cx;
	    let y = cy;
	    let step = Math.PI / 12;

	    this.ctx.strokeSyle = "#000";
	    this.ctx.beginPath();
	    this.ctx.moveTo(cx, cy - outerRadius)
	    for (let i = 0; i < 12; i++) {
	        x = cx + Math.cos(rot) * outerRadius;
	        y = cy + Math.sin(rot) * outerRadius;
	        ctx.lineTo(x, y)
	        rot += step

	        x = cx + Math.cos(rot) * innerRadius;
	        y = cy + Math.sin(rot) * innerRadius;
	        ctx.lineTo(x, y)
	        rot += step
	    }
	    ctx.lineTo(cx, cy - outerRadius)
	    ctx.closePath();
	    ctx.lineWidth=5;
	    ctx.strokeStyle='DarkRed';
	    ctx.stroke();
	    ctx.fillStyle='FireBrick';
	    ctx.fill();
	}

	drawExplosion = function() {
		this.clearBomb();		
		this.explosionInterval = setInterval(function() {
			if(this.explosionCycle > 5) {
				clearInterval(this.explosionInterval);
                this.restartWords();
			} else {
				this.explosionCycle++;
				this.renderExplosion(50*this.explosionCycle);
			}
		}.bind(this), 500);
	}

	clearBomb = function() {
		this.ctx.clearRect(this.startX - this.radius, this.startY - (this.radius +5), this.width,  this.startY + (this.radius +5));		
	}

    restartWords = function() {
        this.ctx.fillStyle = "gold";
        this.ctx.font = "60px Roboto";
        this.ctx.textAlign = "center";
        this.ctx.fillText("You Lose!  Press the escape key to start over.",this.width/2,this.height/2);
    }
    
	renderExplosion = function(x) {
		let outer = x;
		let inner = outer * .4;
		this.drawSpark(this.width / 2, this.height / 2, outer, inner);
	}
}