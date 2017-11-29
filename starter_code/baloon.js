var gravity = 0.1;

function Baloon(canvasId, sprite) {
  // debugger
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.sprite.isReady = false;
  this.sprite.scale = 0.5;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    this.height = this.sprite.height * this.sprite.scale;
    this.radius = this.width/2;
  }).bind(this);

  this.x = 270;
  this.y = 280;
  // this.speed = 5;
  this.vx = 1;
  this.vy = 2;
  this.noMoreGravity=false;
}

Baloon.prototype.isReady = function() {
  return this.sprite.isReady;
};

Baloon.prototype.updateBaloon = function() {
  this.draw();
  // Apply gravity
    this.vy += gravity;
  // }else{
    // this.vy+=0.002;
  // }
  this.x += this.vx;
  this.y += this.vy;
  if ((this.y + this.width) > this.canvas.height || (this.y - this.width) < 0) {
    // debugger
    this.vy *= -1;
  }
  if ((this.x + (this.radius*2)) > this.canvas.width || (this.x) < 0) {
    this.vx *= -1;
  }
};

Baloon.prototype.draw = function() {
  if (this.isReady()) {
    this.ctx.drawImage(
      this.sprite,
      0,
      0,
      this.sprite.width,
      this.sprite.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
};
