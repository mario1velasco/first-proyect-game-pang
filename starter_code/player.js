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
    this.height = this.sprite.height * this.sprite.scale;
    this.widthFrame = Math.floor(this.width / this.sprite.frames);
    this.y = y - this.height;
  }).bind(this);
  this.sprite.frames = 22;
  this.sprite.frameIndex = 0;
  this.x = x - 100;
  this.dead = false;
  this.continue=false;
  document.onkeydown = this.onKeyDown.bind(this);
}

Player.prototype.isReady = function() {
  return this.sprite.isReady;
};

Player.prototype.onKeyDown = function() {
  if (!this.dead) {
    if (event.keyCode == SPACEBAR) {
      this.shoot();
    } else if (event.keyCode == RIGHT_KEY) {
      if ((this.x) < this.canvas.width - this.widthFrame) {
        this.moveToRight();
      }
    } else if (event.keyCode == LEFT_KEY) {
      if ((this.x) > 0) {
        this.moveToLeft();
      }
    }
  }
};
Player.prototype.shoot = function() {
  if (this.sprite.frameIndex <= 4) {
    this.sprite.frameIndex = 21;
  } else if (this.sprite.frameIndex >= 11 && this.sprite.frameIndex <= 19) {
    this.sprite.frameIndex = 20;
  }
};

Player.prototype.moveToRight = function() {
  if (this.sprite.frameIndex >= 4) {
    this.sprite.frameIndex = 0;
  } else {
    this.sprite.frameIndex++;
  }
  this.x += 5;
};
Player.prototype.moveToLeft = function() {
  if (this.sprite.frameIndex <= 4) {
    this.sprite.frameIndex = 11;
  }
  if (this.sprite.frameIndex >= 15) {
    this.sprite.frameIndex = 11;
  } else {
    this.sprite.frameIndex++;
  }
  this.x -= 5;
};
Player.prototype.die = function() {
  this.dead = true;
  if (this.sprite.frameIndex <= 4) {
    this.sprite.frameIndex = 19;
  }
  if (this.sprite.frameIndex >= 11) {
    this.sprite.frameIndex = 10;
  }
};
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
      this.widthFrame, // destination frame width
      this.height); // destination frame heigth
  }
};
