function Options(canvasId, sprite, x, y, frameIndex) {
  // debugger
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.sprite.scale = 1.5;
  this.sprite.isReady = false;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    this.height = this.sprite.height * this.sprite.scale;
    this.widthFrame = Math.floor(this.width / this.sprite.frames);
  }).bind(this);
  // debugger
  this.sprite.frames = 12;
  this.sprite.frameIndex = frameIndex;
  this.x = x;
  this.y = y;
}

Options.prototype.isReady = function() {
  return this.sprite.isReady;
};

Options.prototype.draw = function() {
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
Options.prototype.drawBox = function(boxNumber) {
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
  if(this.y<450)
  this.y += 1;
};
