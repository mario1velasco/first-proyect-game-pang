function Over(canvasId, sprite) {
  this.canvas = canvasId;
  this.ctx = this.canvas.getContext('2d');
  this.sprite = new Image();
  this.sprite.src = sprite;
  this.sprite.isReady = false;
  this.sprite.scale = 0.1;
  this.sprite.onload = (function() {
    this.sprite.isReady = true;
    this.width = this.sprite.width * this.sprite.scale;
    this.height = this.sprite.height * this.sprite.scale;
  }).bind(this);
  this.x = 0;
  this.y = 0;
  this.intervl = "";
  this.countdown = 870;
}

Over.prototype.isReady = function() {
  return this.sprite.isReady;
};

Over.prototype.draw = function() {
  // debugger
  this.ctx.drawImage(
    this.sprite,
    (this.canvas.width - 170) - this.width,
    this.canvas.height - 200 - this.height,
    this.width,
    this.height
  );
this.drawContinue();
  if (this.width < 300)
    this.sprite.scale += 0.002;
  this.width = this.sprite.width * this.sprite.scale;
  this.height = this.sprite.height * this.sprite.scale;
};

Over.prototype.drawContinue = function() {
    //110 son 13s lo justo para poner un sonido
    if(this.countdown <= 870){
      this.ctx.font = '50px serif';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText('Continue?: ' + Math.floor(this.countdown/80), 170, 330);
    }
    this.countdown--;
};
