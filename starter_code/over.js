function Over(canvasId, sprite, win) {
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
  this.win = win;
  this.startCountdown = true;
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
  // debugger
  if (this.win) {
    this.drawEnd(70, 330);
    this.growing(200);
  } else {
    this.drawContinue(170, 330);
    this.growing(300);
  }

};

Over.prototype.growing = function(width) {
  if (this.width < width)
    this.sprite.scale += 0.002;
  this.width = this.sprite.width * this.sprite.scale;
  this.height = this.sprite.height * this.sprite.scale;
};

  Over.prototype.drawContinue = function(x, y) {
  //1100 son 13s lo justo para poner un sonido
  // debugger
  if (this.startCountdown) {
    this.startCountdown=false;
    this.countdown = 870;
  }
  if (this.countdown <= 870) {
    this.ctx.font = 'bold 70px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Continue? ' + Math.floor(this.countdown / 80), x, y);
    // this.ctx.fillText('Press Y.');
    this.ctx.font = 'bold 70px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Press Y ', x + 70, y + 60);
  }
  if (Math.floor(this.countdown / 80) > 0)
    this.countdown--;
  else{
    this.startCountdown = true;
  }
};
Over.prototype.drawEnd = function(x, y) {
  // debugger
  if (this.startCountdown) {
    this.startCountdown=false;
    this.countdown = 240;
  }
  if (this.countdown <= 870) {
    this.ctx.font = 'bold 40px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('YOU WIN, next level in: ' + Math.floor(this.countdown / 80), x, y);
    // this.ctx.fillText('Press Y.');
  }
  if (Math.floor(this.countdown / 80) > 0)
    this.countdown--;
  else{
    this.startCountdown = true;
  }
};
