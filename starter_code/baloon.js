var gravity = 0.1;

function Baloon(canvasId, sprite, x, y, scale, vx, vy) {
  // debugger
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.sprite.isReady = false;
  this.sprite.scale = scale;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    this.widthFrame = Math.floor(this.width);
    this.height = this.sprite.height * this.sprite.scale;
    this.radius = this.width / 2;
  }).bind(this);

  this.x = x;
  this.y = y;
  // this.speed = 5;
  this.vx = vx;
  this.vy = vy;
  // this.noMoreGravity = false;
  // this.maximunY = 480;
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
    this.vy *= -1.014;
    // alert(this.maximunY);
    // if (this.maximunY !== 480 && this.maximunY + this.height > 300) {
    //   // debugger
    //   this.noMoreGravity = true;
    // }
    // this.maximunY = 480;
  }
  if ((this.x + (this.radius * 2)) > this.canvas.width || (this.x) < 0) {
    this.vx *= -1;
  }
  // if (this.maximunY > this.y) {
  //   this.maximunY = Math.floor(this.y);
  // }
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
