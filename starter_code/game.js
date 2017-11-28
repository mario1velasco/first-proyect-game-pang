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
  document.onkeydown = this.continue.bind(this);
  //this.points=0;
}

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.continue = function() {
  if (this.player.dead) {
    if (event.keyCode == Y_KEY) {
      var game = new Game("canvas-fb",640,480);
      game.draw();
    }
  }else{
    this.player.onKeyDown();
  }
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
    this.player.draw();
    // if(this.player.shoot()){
    //
    //   alert("shoot");
    // }
    this.baloon.updateBaloon();
    this.colision();
  } else {
    this.clear();
    this.bg.draw();
    this.player.draw();
    this.baloon.draw();
    this.over.draw();
  }
  this.requestId = window.requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.colision = function() {
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
Game.prototype.dieScene = function() {
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
