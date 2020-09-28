//Core of this functionality is thanks to the tutorial at
// https://code.tutsplus.com/tutorials/create-an-html5-canvas-tile-swapping-puzzle--active-10747
class PuzzleImage {
    constructor(difficulty, imageWidth, imageHeight, imageFile, ctx) {
        this.ctx = ctx;
        this.pieces = [];
        this.difficulty = difficulty;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.imageFile = imageFile;
        this.rawImage = new Image();
        this.image = new Image(this.imageWidth, this.imageHeight);
        this.pieceWidth = Math.floor(this.imageWidth / this.difficulty);
        this.pieceHeight = Math.floor(this.imageHeight / this.difficulty);
    }

    //Create total image slices based upon difficulty
    scrambleImage = function() {
        let i, piece;
        let xPos = 0, yPos = 0;
        for(i = 0;i < this.difficulty * this.difficulty;i++){
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            this.pieces.push(piece);
            xPos += this.pieceWidth;
            if(xPos >= this.imageWidth){
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
        this.pieces = this.mixPieces(this.pieces);
    }

    //Draw the image pieces on the stage
    drawPieces = function(){
        ctx.clearRect(0,0,this.imageWidth,this.imageHeight);
        let i, piece;	
        let xPos = 0, yPos = 0;
        for(i = 0;i < this.pieces.length;i++){
            piece = this.pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            this.ctx.drawImage(this.image, piece.sx, piece.sy, this.pieceWidth, this.pieceHeight, xPos, yPos, this.pieceWidth, this.pieceHeight);
            this.ctx.strokeRect(xPos, yPos, this.pieceWidth,this.pieceHeight);
            xPos += this.pieceWidth;
            if(xPos >= this.imageWidth){
                xPos = 0;
                yPos += this.pieceHeight;
            }
        }
    }

    mixPieces = function(o){
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    loadImage = function() {
        this.rawImage.addEventListener('load', (function() {
            this.resizeImage();
        }).bind(this),false);
        this.rawImage.src = this.imageFile; 
    }

    resizeImage = function() {
        //Get the correct image size/fit for our canvas so we can use that 
        //to draw the puzzle slices
        let imgCanvas = this.fitImageOntoCanvas(this.rawImage);
        this.image.addEventListener('load', (function() {
            this.scrambleImage();
            this.drawPieces();
        }).bind(this),false);
        this.image.src = imgCanvas.toDataURL();
    }

    //Resize the image on an offscreen canvas  
    fitImageOntoCanvas = function(img) {
        let scalingFactor = Math.min((this.imageWidth/img.width),(this.imageHeight/img.height));

        // calc the resized img dimensions
        let iw = img.width*scalingFactor;
        let ih = img.height*scalingFactor;

        // create a new canvas
        let imgC = document.createElement('canvas');
        let imgCtx = imgC.getContext('2d');

        // resize the canvas to the new dimensions
        imgC.width = iw;
        imgC.height = ih;

        // scale & draw the image onto the canvas
        imgCtx.drawImage(img,0,0,iw,ih);
        
        // return the new canvas with the resized image
        return(imgC);
    }    
}


