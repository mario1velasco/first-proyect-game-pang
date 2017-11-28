var Y_KEY=89;

function Game(canvasId, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.requestId = undefined;
  this.beginCount=false;
  this.countdown=320;
  // debugger
  this.bg = new Background(this.canvas, "./images/bg.png", this.width, this.height);
  this.baloon = new Baloon(this.canvas, "./images/baloon1.png");
  this.over = new Over(this.canvas, "./images/game-over.png");
  this.player = new Player(this.canvas, "./images/pang.png", 530, this.height);
  document.onkeydown = this.drawContinue.bind(this);
  this.weaponsShoot=[];
  //this.points=0;
}

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.draw = function() {
  if(this.beginCount){
    this.bg.draw();
    this.baloon.draw();
    this.player.draw();
    this.drawCountdownBeginning(150,200);
  }
  else if (!this.player.dead) {
    this.clear();
    this.bg.draw();
    if(this.player.shoot){
      this.player.shoot=false;
      this.weaponsShoot.push(new Weapon(this.canvas, "./images/weapons2.png", this.player.x, this.player.y));
    }
    for (var i = 0; i < this.weaponsShoot.length; i++) {
      this.weaponColision(i);
      if(this.weaponsShoot[i].y===0){
        this.weaponsShoot.splice(i, 1);
      }else{
        this.weaponsShoot[i].draw();
      }
    }
    this.player.draw();
    this.baloon.updateBaloon();
    this.playerColision();
  } else {
    this.clear();
    this.bg.draw();
    this.player.draw();
    this.baloon.draw();
    this.over.draw();
  }
  this.requestId = window.requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.playerColision = function() {
  //If you change the value of the baloon os the player you have to re configurated all this numbers
  if ((this.baloon.y + this.baloon.height) >= (this.player.y)) {
    if ((this.player.x + 29) > this.baloon.x) {
      if (this.player.x < this.baloon.x + 33) {
        // debugger
        this.player.die();
        this.baloon.updateBaloon();
        this.baloon.updateBaloon();
        this.baloon.updateBaloon();
        this.player.draw();
        // window.cancelAnimationFrame(requestId);
        // requestId = undefined;

      }
    }
  }
};

Game.prototype.weaponColision = function (i) {
  if((this.baloon.x===(this.weaponsShoot[i].x+this.weaponsShoot[i].widthFrame-10))||
  (this.weaponsShoot[i].x===(this.baloon.x+this.baloon.width))){
    if(this.weaponsShoot[i].y<this.baloon.y)
    // alert("cool2");
    console.log("");
  }
  if((this.weaponsShoot[i].y<=(this.baloon.y+this.baloon.height))&&
  (this.weaponsShoot[i].y>=(this.baloon.y+this.baloon.height-6))){
    if(this.weaponsShoot[i].x<this.baloon.x)
    alert("cool1");
  }
  // if(this.baloon.x===(this.weaponsShoot[i].x+this.weaponsShoot[i].widthFrame-10)){
  //   if(this.weaponsShoot[i].y<this.baloon.y)
  //   alert("cool1");
  // }
  // if(this.weaponsShoot[i].x===(this.baloon.x+this.baloon.width)){
  //   if(this.weaponsShoot[i].y<this.baloon.y)
  //   alert("cool2");
  // }
};

Game.prototype.drawContinue = function() {
  if (this.player.dead) {
    if (event.keyCode == Y_KEY) {
      var game = new Game("canvas-fb",640,480);
      game.draw();
    }
  }else{
    this.player.onKeyDown();
  }
};

Game.prototype.drawCountdownBeginning = function(x,y) {
  //1100 son 13s lo justo para poner un sonido
  if (this.countdown <= 870) {
    this.ctx.font = '50px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Are you ready? ' + Math.floor(this.countdown / 80), x, y);
  }
  if (Math.floor(this.countdown / 80) > 0){
    this.countdown--;
  }else{
    this.beginCount=false;
  }
};
