var Y_KEY = 89;

function Game(canvasId, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.requestId = undefined;
  this.beginCount = true;
  this.countdown = 180;
  // debugger


  this.bg = new Background(this.canvas, "./images/bg3units.png", this.width, this.height);
  this.over = new Over(this.canvas, "./images/game-over.png");
  //this.points=0;
  this.arrayLifes = [];
  this.weaponsShoot = [];
  this.player = new Player(this.canvas, "./images/pang.png", 370, this.height);
  this.arrayBaloons = [];
  this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png", 50, 190, 0.5, 1, 2));
  // this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",450,400,1,1));
  // this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",410,50,0.5));
  // this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",350,50,2));
  this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 490, 30, 7));
  // this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 530, 30, 7));
  // this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 570, 30, 7));


  document.onkeydown = this.drawContinue.bind(this);
}

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.drawContinue = function() {
  debugger
  if (this.player.dead) {
    if (event.keyCode == Y_KEY) {
      var game = new Game("canvas-fb", 640, 480);
      game.draw();
    }
  } else {
    this.player.onKeyDown();
  }
};

Game.prototype.draw = function() {
  if (this.beginCount) {
    this.bg.draw();
    this.paintBaloons(this.beginCount);
    this.player.draw();
    this.paintLifes();
    this.drawCountdownBeginning(150, 200);
  } else if (!this.player.dead) {
    this.clear();
    this.bg.draw();
    if (this.player.shoot) {
      this.player.shoot = false;
      this.weaponsShoot.push(new Weapon(this.canvas, "./images/weapons2.png", this.player.x, this.player.y));
    }
    for (var i = 0; i < this.weaponsShoot.length; i++) {
      // debugger
      this.arrayBaloons.forEach((function(element, index, array) {
        // this.weaponColision(element, i, index, array);
        if (this.weaponColision(element, i, index, array)) {
          //Split ball in two or delete it
          this.dividedBaloon(element, index, array);
        }
      }).bind(this));
      this.paintShoot(i);
    }
    // debugger
    this.player.draw();
    this.paintLifes();
    this.paintBaloons(false);
    this.arrayBaloons.forEach((function(element, index, array) {
      this.playerColision(element, index, array);
    }).bind(this));
  } else {
    // debugger
    this.playerDie();
  }
  this.requestId = window.requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.paintShoot = function (i) {
  if (this.weaponsShoot[i].y === 0) {
    this.weaponsShoot.splice(i, 1);
  } else {
    this.weaponsShoot[i].draw();
  }
};

Game.prototype.playerDie = function() {
  if (this.arrayLifes.length > 1 && (this.beginCount === false)) {
    this.arrayLifes.pop();
    this.beginCount = true;
    this.player.dead = false;
    this.countdown = 280;
    this.player = new Player(this.canvas, "./images/pang.png", 370, this.height);
    this.arrayBaloons = [];
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png", 50, 190, 0.5, 1, 2));
  } else {
    this.clear();
    this.bg.draw();
    this.player.draw();
    this.paintLifes();
    this.paintBaloons(true);
    this.over.draw();
  }
};

Game.prototype.dividedBaloon = function(element, index, array) {
  // debugger
  if (element.scale === 0.5)
    array.splice(index, 1);
  else {
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",
      (element.x + element.radius + 10), (element.y - 20), (element.sprite.scale - 0.5), 1, -2));
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",
      (element.x + element.radius - 10), (element.y - 20), (element.sprite.scale - 0.5), -1, -2));
    array.splice(index, 1);
  }
};

Game.prototype.weaponColision = function(element, i, index, array) {
  var colision = false;
  //COLISION VERTICAL
  // debugger
  if (this.weaponsShoot[i].y < element.y + Math.floor(element.width)) {
    if ((element.x === (this.weaponsShoot[i].x + Math.floor(this.weaponsShoot[i].widthFrame) - 10))) {
      // alert("COL VERTICAL Derecha");
      colision = true;
    }
    if ((this.weaponsShoot[i].x === (element.x + Math.floor(element.width)))) {
      // alert("COL VERTICAL Izquierda");
      colision = true;
    }
  }
  //COLISON FRONTAL
  //primero comprueba que el y de la bola y player coincidan +-6
  if ((this.weaponsShoot[i].y <= (element.y + element.height)) &&
    (this.weaponsShoot[i].y >= (element.y + element.height - 6))) {
    //Calcula para cada pixel del arma x si esta entre la bola, si esta hay colisión
    // debugger
    for (var j = 0; j <= this.weaponsShoot[i].widthFrame; j++) {
      if (this.weaponsShoot[i].x + j > element.x) {
        if (this.weaponsShoot[i].x + j <= element.x + Math.floor(element.width) + 2) {
          // alert("Frontal colision");
          colision = true;
          break;
        }
      }
    }
  }
  return colision;
};

Game.prototype.playerColision = function(element, index, array) {
  var isColision = false;
  //COLISION VERTICAL
  if ((element.y + element.height) > this.player.y) {
    if (((element.x + Math.floor(element.width)) === this.player.x + 3)) {
      isColision = true;
      // debugger
      // alert("COL VERTICAL Izquierda");
    }
    if ((element.x === (this.player.x + Math.floor(this.player.widthFrame) - 10))) {
      isColision = true;
      // debugger
      // alert("COL VERTICAL Derecha");
    }
  }
  //COLISON FRONTAL
  //primero comprueba que el y de la bola y player coincidan +-6
  if ((this.player.y <= (element.y + element.height)) &&
    (this.player.y >= (element.y + element.height - 10))) {
    //Calcula para cada pixel del player x, si esta entre la bola, si esta hay colisión
    for (var j = 0; j <= this.player.widthFrame - 10; j++) {
      //Lado derecho
      if (this.player.x + j > element.x) {
        //Lado izquierdo
        if (this.player.x + j + 3 < element.x + Math.floor(element.width)) {
          // debugger
          isColision = true;
          break;
          // alert("COL FRONTAL");
        }
      }
    }
  }
  if (isColision) {
    // debugger
    this.player.die();
    element.updateBaloon();
    element.updateBaloon();
    element.updateBaloon();
    this.player.draw();
  }
};

Game.prototype.paintLifes = function() {
  this.arrayLifes.forEach(function(element) {
    element.draw();
  });
};

Game.prototype.paintBaloons = function(beginCount) {
  // debugger
  if (beginCount) {
    this.arrayBaloons.forEach(function(element) {
      element.draw();
    });
  } else {
    this.arrayBaloons.forEach(function(element) {
      element.updateBaloon();
    });
  }
};

Game.prototype.drawContinue = function() {
  debugger
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
