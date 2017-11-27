var gravity = 0.3;

function Baloon(canvasId, sprite) {
  // debugger
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.sprite.isReady = false;
  this.sprite.scale = 1;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    this.height = this.sprite.height * this.sprite.scale;
  }).bind(this);

  this.x = 50;
  this.y = 50;
  // this.speed = 5;
  this.vx = 1;
  this.vy = 2;
  this.radius = 25;
  this.minimunY = 0;
  this.noMoreGravity=false;
}

Baloon.prototype.isReady = function() {
  return this.sprite.isReady;
};

Baloon.prototype.updateBaloon = function() {
  this.draw();
  // Apply gravity
  if (!this.noMoreGravity) {
    // this.minimunY = this.y;
    this.vy += gravity;
  }else{
    // this.vy+=0.002;
  }
  this.x += this.vx;
  this.y += this.vy;
  if (this.minimunY > this.y) {
    this.minimunY = this.y;
  }
  if ((this.y + this.radius) > this.canvas.height || (this.y - this.radius) < 0) {
    this.vy *= -1;
    if(this.minimunY>85){
      this.noMoreGravity=true;
      alert(this.minimunY);
    }
    this.minimunY = 480;
  }
  if ((this.x + this.radius) > this.canvas.width || (this.x - this.radius) < 0) {
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
