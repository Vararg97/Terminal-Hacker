let canvas, ctx;

function init () {
  canvas = document.getElementById('terminal');
  ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "white";
  ctx.font = "10px Inconsolata, monospace";
ctx.fillText("Hello World", 10, 30);
}

document.addEventListener('DOMContentLoaded', init);