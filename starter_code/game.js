var Y_KEY = 89;

function Game(canvasId, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.requestId = undefined;
  // this.beginCountdown = true;
  // this.countdown = 180;
  this.maxShoots = 1;
  this.weaponSelect = 1;
  // debugger
  this.loadFirstTime = true;
  this.optionSelected = "";
  this.optionCounter = 0;
  this.arrayLifes = [];
  this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 490, 30, 7));
  this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 530, 30, 7));
  // this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 570, 30, 7));

  this.gameLevel = 1;
  // document.onkeydown = this.drawContinue.bind(this);
}

Game.prototype.loadValues = function() {
  this.beginCountdown = true;
  this.countdown = 180;
  this.bg = new Background(this.canvas, "./images/bg8.png", this.width, this.height);
  this.over = new Over(this.canvas, "./images/game-over.png");
  this.win = new Over(this.canvas, "./images/You_win_this_time.png", true);
  //this.points=0;
  this.weaponsShoot = [];
  this.arrayOptionsBox = [];
  this.player = new Player(this.canvas, "./images/pang.png", 370, this.height);
  this.arrayBaloons = [];
  for (var i = 1; i <= this.gameLevel; i++) {
    var ballPositionX = Math.floor(Math.random() * 560);
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png", ballPositionX, 190, 1.5, 1, 2));
  }
  document.onkeydown = this.drawContinue.bind(this);
  document.onkeyup = this.drawStop.bind(this);


};

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.drawContinue = function() {
  if (this.player.dead) {
    if (event.keyCode == Y_KEY) {
      var game = new Game("canvas-fb", 640, 480);
      game.draw();
    }
  } else {
    // debugger
    this.player.onKeyDown();
  }
};
Game.prototype.drawStop = function() {
  // debugger
  this.player.onKeyUp();
};

Game.prototype.draw = function() {
  if (this.loadFirstTime) {
    //Load inicial values
    this.loadFirstTime = false;
    this.loadValues();
  }
  if (this.beginCountdown) {
    //countdown
    this.bg.draw();
    this.paintBaloons(this.beginCountdown);
    this.player.draw();
    this.paintLifes();
    this.drawCountdownBeginning(50, 150);
  } else if (this.arrayBaloons.length === 0) {
    // You explote all balls
    this.paintWin();
  } else if (!this.player.dead) {
    // Normal game
    this.clear();
    this.bg.draw();
    this.shootAndCHeckColisionWithBalls(this.player.shoot);
    this.player.draw();
    this.paintLifes();
    this.paintBaloons(false, this.optionSelected);
    this.paintOptionBoxs();
    this.arrayBaloons.forEach((function(element, index, array) {
      if (this.playerColision(element, index, array)) {
        this.player.die();
        element.updateBaloon();
        element.updateBaloon();
        element.updateBaloon();
        this.player.draw();
      }
    }).bind(this));
    this.arrayOptionsBox.forEach((function(element, index, array) {
      if (this.playerColision(element, index, array)) {
        this.pickAnOptionBox(element, index, array);
      }
    }).bind(this));
  } else {
    //Player die
    this.playerDie();
  }
  this.requestId = window.requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.shootAndCHeckColisionWithBalls = function(bool) {
  // debugger
  if (bool) {
    // debugger
    this.player.shoot = false;
    if (this.maxShoots !== this.weaponsShoot.length) {
      this.weaponsShoot.push(new Weapon(this.canvas, "./images/weapons2.png",
        this.player.x, this.player.y, this.weaponSelect));
    }
  }
  var impact = false;
  for (var i = 0; i < this.weaponsShoot.length; i++) {
    this.arrayBaloons.forEach((function(element, index, array) {
      if (this.weaponColision(element, i, index, array)) {
        //Split ball in two or delete it
        this.dividedBaloon(element, index, array);
        impact = true;
      }
    }).bind(this));
    this.paintShoot(i, impact, this.weaponSelect);
  }
};

Game.prototype.pickAnOptionBox = function(element, index, array) {
  switch (element.sprite.frameIndex) {
    case 0:
      this.weaponSelect = 1;
      this.maxShoots = 2;
      this.optionSelected = 0;
      array.splice(index, 1);
      break;
    case 1:
      this.weaponSelect = 3;
      this.maxShoots = 10;
      this.optionSelected = 1;
      array.splice(index, 1);
      break;
    case 2:
      this.weaponSelect = 0;
      this.maxShoots = 1;
      this.optionSelected = 2;
      array.splice(index, 1);
      break;
    case 3:
      //dinamite
      this.optionSelected = 3;
      array.splice(index, 1);
      break;
    case 4:
      //dinamite
      this.optionSelected = 4;
      array.splice(index, 1);
      break;
    case 5:
      //ball stop
      this.optionSelected = 5;
      this.optionCounter=0;
      array.splice(index, 1);
      break;
    case 6:
      //crazy gravity
      this.optionSelected = 6;
      this.optionCounter=0;
      array.splice(index, 1);
      break;
    case 7:
      //life
      this.optionSelected = 7;
      array.splice(index, 1);
      break;
    default:
      this.optionSelected = "";

  }
};

Game.prototype.paintWin = function() {
  // debugger
  this.clear();
  this.bg.draw();
  this.player.win();
  this.player.draw();
  if (this.win.countdown > 80) {
    this.win.draw();
  } else {
    // debugger
    this.gameLevel++;
    this.loadValues();
  }
};


Game.prototype.playerDie = function() {
  if (this.arrayLifes.length > 1 && (this.beginCountdown === false)) {
    //Initialize components if you got lifes
    this.arrayLifes.pop();
    this.player.dead = false;
    this.player.x = 270;
    this.loadValues();
  } else {
    // Paint dead scene
    this.arrayLifes.pop();
    this.player.dead = true;
    this.clear();
    this.bg.draw();
    this.paintLifes();
    this.paintBaloons(true);
    if (this.over.countdown > 80) {
      this.player.draw();
      this.over.draw();
    } else {
      this.player.drawDead();
      // debugger
      // this.gameLevel++;
      // this.loadValues();
    }
  }
};

Game.prototype.dividedBaloon = function(element, index, array, isDinamite) {
  if (element.sprite.scale === 0.5)
    if(!isDinamite)
    array.splice(index, 1);
  else {
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",
      (element.x + element.radius + 10), (element.y - 20), (element.sprite.scale - 0.5), 1, -2));
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",
      (element.x + element.radius - 10), (element.y - 20), (element.sprite.scale - 0.5), -1, -2));
    array.splice(index, 1);
    //CREATE AN OPTION BOX
    // debugger
    this.arrayOptionsBox.push(new Options(this.canvas, "./images/options2.png", element.x, element.y, //1));
      Math.floor(Math.random() * 7)));
  }
};

Game.prototype.paintOptionBoxs = function() {
  this.arrayOptionsBox.forEach(function(element, index, array) {
    element.drawBox();
    if (element.y >= 450) {
      array.splice(index, 1);
    }
  });
};

Game.prototype.weaponColision = function(element, i, index, array) {
  var colision = false;
  //COLISION VERTICAL
  // debugger
  if (this.weaponSelect !== 3) {
    if (this.weaponsShoot[i].y < element.y + Math.floor(element.width)) {
      if ((Math.floor(element.x) === (this.weaponsShoot[i].x + Math.floor(this.weaponsShoot[i].widthFrame) - 10))) {
        // alert("COL VERTICAL Derecha");
        colision = true;
      }
      if ((this.weaponsShoot[i].x === (Math.floor(element.x) + Math.floor(element.width)))) {
        // alert("COL VERTICAL Izquierda");
        colision = true;
      }
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
    if (((element.x + Math.floor(element.widthFrame)) === this.player.x + 3)) {
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
        if (this.player.x + j + 3 < element.x + Math.floor(element.widthFrame)) {
          // debugger
          isColision = true;
          break;
          // alert("COL FRONTAL");
        }
      }
    }
  }
  return isColision;
};

Game.prototype.paintShoot = function(i, impact, weaponSelect) {
  // debugger
  if (weaponSelect === 0 && this.weaponsShoot[i].y < 3) {
    this.weaponsShoot[i].y += 3;
    this.weaponsShoot[i].draw();
    if (impact === true) {
      this.weaponsShoot.splice(i, 1);
    }
  } else {
    if (this.weaponsShoot[i].y <= 0 || impact === true) {
      // debugger
      this.weaponsShoot.splice(i, 1);
    } else {
      this.weaponsShoot[i].draw();
    }
  }
};

Game.prototype.paintLifes = function() {
  this.arrayLifes.forEach(function(element) {
    element.draw();
  });
};

Game.prototype.paintBaloons = function(beginCountdown, option) {
  // debugger
  if (beginCountdown) {
    this.arrayBaloons.forEach(function(element) {
      element.draw();
    });
  } else {
    this.arrayBaloons.forEach(function(element) {
      if (option === 5 && this.optionCounter < 400) {
        element.draw();
        this.optionCounter++;
      } else if (option === 6 && this.optionCounter < 900) {
        element.gravity=0;
        element.updateBaloon();
        this.optionCounter++;
      } else if(option === 3 || option === 4){
        debugger
        this.dividedBaloon(element, index, array, true);
      }else {
        element.gravity=0.1;
        element.updateBaloon();
      }
    }.bind(this));
  }
};

Game.prototype.drawContinue = function() {
  // debugger
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
    this.ctx.font = 'bold 70px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Are you ready? ' + Math.floor(this.countdown / 80), x, y);
  }
  if (Math.floor(this.countdown / 80) > 0) {
    this.countdown--;
  } else {
    this.beginCountdown = false;
  }
};
