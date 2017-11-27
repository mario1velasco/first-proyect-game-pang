var SPACEBAR = 32;
var RIGHT_KEY = 39;
var LEFT_KEY = 37;

function Player(canvasId, sprite, x, y) {
  // debugger
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.sprite.isReady = false;
  this.sprite.scale = 1.5;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    // debugger
    this.height = this.sprite.height * this.sprite.scale;
    this.y = y-this.height;
  }).bind(this);
  this.sprite.frames = 22;
  this.sprite.frameIndex = 0;
  this.x = x/2;

  document.onkeydown = this.onKeyDown.bind(this);
}

Player.prototype.isReady = function() {
  return this.sprite.isReady;
};

Player.prototype.onKeyDown = function() {
  if (event.keyCode == SPACEBAR) {
  }else if (event.keyCode == RIGHT_KEY) {
    this.x +=5;
  }else if (event.keyCode == LEFT_KEY) {
    this.x -=5;
  }
};
//
// Player.prototype.updateBird = function() {
//   this.draw();
//
//   if ((this.y) > this.canvas.height || (this.y) < 0) {
//
//   }
//   if ((this.x) > this.canvas.width || (this.x) < 0) {
//
//   }
// };

Player.prototype.draw = function() {
  if (this.isReady) {
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames), // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames), // frame width
      this.sprite.height, // frame heigth
      this.x, // destination x
      this.y, // destination y
      Math.floor(this.width / this.sprite.frames), // destination frame width
      this.height); // destination frame heigth
  }
};
