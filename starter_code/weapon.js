function Weapon(canvasId, sprite, x, y, weaponSelect) {
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
  }).bind(this);
  this.sprite.frames = 20;
  this.sprite.frameIndex = weaponSelect;
  this.x = x;
  this.y = y;
  // document.onkeydown = this.onKeyDown.bind(this);
}

Weapon.prototype.isReady = function() {
  return this.sprite.isReady;
};

Weapon.prototype.draw = function() {
  // debugger
  if(this.sprite.frameIndex ===3){
    this.paintSubMachineGun();
  }else{
    this.paintGun();
  }
};

Weapon.prototype.paintGun = function () {
  if (this.isReady) {
    this.ctx.drawImage(
      this.sprite, // Image
      this.sprite.frameIndex * Math.floor(this.sprite.width / this.sprite.frames) + 1, // source x
      0, // source y: allways 0 for this image
      Math.floor(this.sprite.width / this.sprite.frames) - 6, // frame width
      this.sprite.height - 2, // frame heigth
      this.x, // destination x
      this.y, // destination y
      this.widthFrame, // destination frame width
      this.height); // destination frame heigth
  }
  this.y -= 3;
};

Weapon.prototype.paintSubMachineGun = function () {
  if (this.isReady) {
    context.beginPath();
      context.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
      context.fillStyle = 'green';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
  }
};
