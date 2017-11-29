var Y_KEY = 89;

function Game(canvasId, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.requestId = undefined;
  this.beginCount = false;
  this.countdown = 320;
  // debugger
  this.bg = new Background(this.canvas, "./images/bg3units.png", this.width, this.height);
  this.baloon = new Baloon(this.canvas, "./images/baloon1.png");
  this.over = new Over(this.canvas, "./images/game-over.png");
  this.player = new Player(this.canvas, "./images/pang.png", 370, this.height);
  document.onkeydown = this.drawContinue.bind(this);
  this.weaponsShoot = [];
  //this.points=0;
}

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.draw = function() {
  if (this.beginCount) {
    this.bg.draw();
    this.baloon.draw();
    this.player.draw();
    this.drawCountdownBeginning(150, 200);
  } else if (!this.player.dead) {
    this.clear();
    this.bg.draw();
    if (this.player.shoot) {
      this.player.shoot = false;
      this.weaponsShoot.push(new Weapon(this.canvas, "./images/weapons2.png", this.player.x, this.player.y));
    }
    for (var i = 0; i < this.weaponsShoot.length; i++) {
      this.weaponColision(i);
      if (this.weaponsShoot[i].y === 0) {
        this.weaponsShoot.splice(i, 1);
      } else {
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
  var isColision=false;
  //COLISION VERTICAL
  if ((this.baloon.y + this.baloon.height) > this.player.y) {
    if (((this.baloon.x + Math.floor(this.baloon.width)) === this.player.x+3)) {
      isColision=true;
      // debugger
      // alert("COL VERTICAL Izquierda");
    }
    if ((this.baloon.x === (this.player.x + Math.floor(this.player.widthFrame)-10))) {
      isColision=true;
      // debugger
      // alert("COL VERTICAL Derecha");
    }
  }
  //COLISON FRONTAL
  //primero comprueba que el y de la bola y player coincidan +-6
  if((this.player.y<=(this.baloon.y+this.baloon.height))&&
  (this.player.y>=(this.baloon.y+this.baloon.height-6))){
    //Calcula para cada pixel del player x, si esta entre la bola, si esta hay colisión
    for(var j=0;j<=this.player.widthFrame-10;j++){
      //Lado derecho
      if(this.player.x+j>this.baloon.x){
        //Lado izquierdo
        if(this.player.x+j+3<this.baloon.x+Math.floor(this.baloon.width)){
          isColision=true;
          // debugger
          // alert("COL FRONTAL");
        }
      }
    }
  }
  if(isColision){
    this.player.die();
    this.baloon.updateBaloon();
    this.baloon.updateBaloon();
    this.baloon.updateBaloon();
    this.player.draw();

    // window.cancelAnimationFrame(requestId);
    // requestId = undefined;
  }
};

Game.prototype.weaponColision = function(i) {
  //COLISION VERTICAL
  if (this.weaponsShoot[i].y < this.baloon.y){
    if ((this.baloon.x === (this.weaponsShoot[i].x + this.weaponsShoot[i].widthFrame-10))){
      //FUNCIONA
      // alert("COL VERTICAL Derecha");
    }
    if((this.weaponsShoot[i].x === (this.baloon.x + this.baloon.width))){
      debugger
      // alert("COL VERTICAL Izquierda");
    }
  }

  //COLISON FRONTAL
  //primero comprueba que el y de la bola y player coincidan +-6
  if ((this.weaponsShoot[i].y <= (this.baloon.y + this.baloon.height)) &&
    (this.weaponsShoot[i].y >= (this.baloon.y + this.baloon.height - 6))) {
    //Calcula para cada pixel del arma x si esta entre la bola, si esta hay colisión
    for (var j = 0; j <= this.weaponsShoot[i].widthFrame; j++) {
      if (this.weaponsShoot[i].x + j > this.baloon.x) {
        if (this.weaponsShoot[i].x + j < this.baloon.x + this.baloon.width) {
          // debugger
          // alert("Frontal colision");
          debugger
          return true;
        }
      }
    }
  }

};

Game.prototype.drawContinue = function() {
  if (this.player.dead) {
    if (event.keyCode == Y_KEY) {
      var game = new Game("canvas-fb", 640, 480);
      game.draw();
    }
  } else {
    this.player.onKeyDown();
  }
};

Game.prototype.drawCountdownBeginning = function(x, y) {
  //1100 son 13s lo justo para poner un sonido
  if (this.countdown <= 870) {
    this.ctx.font = '50px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Are you ready? ' + Math.floor(this.countdown / 80), x, y);
  }
  if (Math.floor(this.countdown / 80) > 0) {
    this.countdown--;
  } else {
    this.beginCount = false;
  }
};
