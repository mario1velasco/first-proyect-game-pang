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
  this.speed=2;
  this.continue = false;
  this.shoot = false;
  this.isMoving = true;
  this.points=0;
  this.action = "";
  document.onkeydown = this.onKeyDown.bind(this);
  document.onkeyup = this.onKeyUp.bind(this);
  // document.addEventListener("keydown", onKeyDown, false);
  // document.addEventListener("keyup", onKeyUp, false);
}

Player.prototype.isReady = function() {
  return this.sprite.isReady;
};

Player.prototype.onKeyDown = function() {
  if (event.keyCode == SPACEBAR) {
    this.isMoving = true;
    this.action = "S";
    // this.shooting();
  } else if (event.keyCode == RIGHT_KEY) {
    if ((this.x) < this.canvas.width - this.widthFrame) {
      this.isMoving = true;
      this.action = "R";
      // this.moveToRight();
    }
  } else if (event.keyCode == LEFT_KEY) {
    if ((this.x) > 0) {
      this.isMoving = true;
      this.action = "L";
      // this.moveToLeft();
    }
  }
};

Player.prototype.onKeyUp = function() {
  // debugger
  if ((event.keyCode == LEFT_KEY) || (event.keyCode == RIGHT_KEY) ||
    (event.keyCode == SPACEBAR)) {
    this.isMoving = false;
  }
};



Player.prototype.draw = function() {
  if (this.isReady) {
    if (this.isMoving) {
      if (this.action == "R") {
        this.moveToRight();
      } else if (this.action == "L") {
        this.moveToLeft();
      } else if (this.action == "S") {
        this.shooting();
      }
    }
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames), // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames) - 3, // frame width quito -3 porque sobre 3 px del lado derecho
      this.sprite.height - 1, // frame heigth sobra 1px de abajo
      this.x, // destination x
      this.y, // destination y
      this.widthFrame, // destination frame width
      this.height); // destination frame heigth
  }
};

Player.prototype.drawDead = function() {
  if (this.isReady) {
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames), // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames) - 3, // frame width quito -3 porque sobre 3 px del lado derecho
      this.sprite.height - 1, // frame heigth sobra 1px de abajo
      this.x, // destination x
      this.y, // destination y
      this.widthFrame, // destination frame width
      this.height); // destination frame heigth
  }
  this.y--;
};

Player.prototype.shooting = function() {
  if (this.sprite.frameIndex <= 4) {
    this.sprite.frameIndex = 21;
    this.shoot = true;
  } else if (this.sprite.frameIndex >= 11 && this.sprite.frameIndex <= 19) {
    this.sprite.frameIndex = 20;
    this.shoot = true;
  } else if (this.sprite.frameIndex === 20 || this.sprite.frameIndex === 21)
    this.shoot = true;
};

Player.prototype.moveToRight = function() {
  if (this.sprite.frameIndex >= 4) {
    this.sprite.frameIndex = 0;
  } else {
    this.sprite.frameIndex++;
  }
  this.x += this.speed;
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
  this.x -= this.speed;
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

Player.prototype.win = function() {
  this.sprite.frameIndex = 9;

};
