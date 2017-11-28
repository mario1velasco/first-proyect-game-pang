function Weapon(canvasId, sprite, x, y) {
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
    // this.y = y - this.height;
  }).bind(this);
  this.sprite.frames = 20;
  this.sprite.frameIndex = 0;
  this.x = x; //- this.height;
  this.y = y;
  this.dead = false;
  this.continue=false;
  // debugger
  // document.onkeydown = this.onKeyDown.bind(this);
}

Weapon.prototype.isReady = function() {
  return this.sprite.isReady;
};

Weapon.prototype.shoot = function() {

};

Weapon.prototype.draw = function() {
  if (this.isReady) {
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames), // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames)-4, // frame width
      this.sprite.height-2, // frame heigth
      this.x, // destination x
      this.y, // destination y
      this.widthFrame, // destination frame width
      this.height); // destination frame heigth
  }
  this.y -=3;
};
//
// Obstacle.prototype.draw = function() {
//   // debugger
//   this.ctx.save();
//   this.ctx.fillStyle = "red";
//   this.ctx.fillRect(this.x, this.y, this.width, this.height);
//   this.y +=3;
//   this.ctx.restore();
// };
