function Background(canvasId, sprite, width, height) {
  // debugger
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.x = 0;
  this.sprite.scale=1;
  this.sprite.isReady = false;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    this.height = this.sprite.height * this.sprite.scale;
    this.widthFrame = Math.floor(this.width / this.sprite.frames);
  }).bind(this);
  // debugger
  this.sprite.frames = 3;
  this.sprite.frameIndex = Math.floor(Math.random()*3);
  this.x = 0;
}

Background.prototype.isReady = function() {
  return this.sprite.isReady;
};

Background.prototype.draw = function() {
  if (this.isReady) {
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames), // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames), // frame width
      this.sprite.height, // frame heigth
      this.x, // destination x
      0, // destination y
      640,//this.widthFrame, // destination frame width
      480);//this.height); // destination frame heigth
  }
};
/*


Background.prototype.isReady = function() {
  return this.sprite.isReady;
};

Background.prototype.draw = function() {
  debugger
  if (this.isReady) {
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames), // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames), // frame width
      this.sprite.height, // frame heigth
      this.x, // destination x
      0, // destination y
      this.widthFrame, // destination frame width
      this.height); // destination frame heigth
  }
};
*/
