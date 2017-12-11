var Y_KEY = 89;

function Game(canvasId, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
  this.requestId = undefined;
  this.maxShoots = 1;
  this.weaponSelect = 1;
  this.loadFirstTime = true;
  this.optionSelected = "";
  this.optionCounter = 900;
  this.points = 0;
  if (localStorage.recordPoints)
    this.recordPoints = localStorage.recordPoints;
  else
    this.recordPoints = 0;
  this.arrayLifes = [];
  this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 490, 30, 7));
  this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 530, 30, 7));
  this.gameLevel = 1;
  this.bg = "";
  this.win = "";
  this.over = "";
  this.player = "";
}

Game.prototype.loadValues = function() {
  //Initialize values at the beggining and when you die
  this.bg = new Background(this.canvas, "./images/bg8.png", this.width, this.height);
  this.win = new Over(this.canvas, "./images/You_win_this_time.png", true);
  this.over = new Over(this.canvas, "./images/game-over.png",false);
  this.player = new Player(this.canvas, "./images/pang.png", 370, this.height);

  this.beginCountdown = true;
  this.countdown = 280;
  this.weaponsShoot = [];
  this.arrayOptionsBox = [];
  this.isDead = false;
  this.arrayBaloons = [];
  for (var i = 1; i <= this.gameLevel; i++) {
    var ballPositionX = Math.floor(Math.random() * 560);
    var ballPositiony = Math.floor(Math.random() * 90) + 100;
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png", ballPositionX, ballPositiony, 1.5, 1, 2));
  }
  this.soundsAndEffects("stage" + (Math.floor(Math.random() * 3) + 1));
  document.onkeydown = this.keyDown.bind(this);
  document.onkeyup = this.keyUp.bind(this);
};


Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.draw = function() {
  this.paintScore();
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
    this.soundsAndEffects("stageClear");
    this.paintWin();
  } else if (!this.isDead) {
    // Normal game
    this.clear();
    this.bg.draw();
    this.shootAndCHeckColisionWithBalls(this.player.shoot);
    this.player.draw();
    this.paintLifes();
    this.paintBaloons(false, this.optionSelected);
    this.apllyOptions(this.optionSelected);
    this.paintOptionBoxs();
    this.arrayOptionsBox.forEach((function(element, index, array) {
      if (this.playerColision(element, index, array)) {
        this.soundsAndEffects("optionBox");
        this.pickAnOptionBox(element, index, array);
      }
    }).bind(this));
    this.arrayBaloons.forEach((function(element, index, array) {
      if (this.playerColision(element, index, array)) {
        //Change this.player.die set to true and sprite
        this.soundsAndEffects("intro");
        this.soundsAndEffects("dead");
        this.isDead = true;
        this.player.die();
        element.updateBaloon();
        element.updateBaloon();
        element.updateBaloon();
        this.player.draw();
      }
    }).bind(this));
  } else {
    //Player die
    this.playerDie();
  }
  this.requestId = window.requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.drawCountdownBeginning = function(x, y) {
  //1100 son 13s lo justo para poner un sonido
  if (this.countdown <= 870) {
    this.ctx.font = 'bold 70px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Are you ready? ' + Math.floor(this.countdown / 80), x, y);
    this.ctx.fillText('LEVEL ' + this.gameLevel, x, y-50);
  }
  if (Math.floor(this.countdown / 80) > 0) {
    this.countdown--;
  } else {
    this.beginCountdown = false;
  }
};

Game.prototype.playerDie = function() {
  // If you got lifes and it is not the countdown from the beggining
  if (this.arrayLifes.length > 1 && (this.beginCountdown === false)) {
    this.arrayLifes.pop();
    this.player.x = 270;
    this.loadValues();
  } else {
    // Paint dead scene
    // this.soundsAndEffects("continue");
    this.arrayLifes.pop();
    this.clear();
    this.bg.draw();
    this.paintLifes();
    this.paintBaloons(true);
    if (this.over.countdown > 80) {
      this.player.draw();
      this.over.draw();
    } else {
      // this.soundsAndEffects("gameOver");
      this.player.drawDead();
    }
  }
};

Game.prototype.paintWin = function() {
  this.clear();
  this.bg.draw();
  this.player.win();
  this.player.draw();
  if (this.win.countdown > 80) {
    this.win.draw();
  } else {
    this.points += (this.gameLevel * 100);
    this.gameLevel++;
    this.loadValues();
  }
};

Game.prototype.paintScore = function() {
  var points = document.getElementById('points');
  points.innerHTML = this.points;
  var recordPoints = document.getElementById('max-points');
  recordPoints.innerHTML = this.recordPoints;
  if (this.points >= this.recordPoints) {
    this.recordPoints = this.points;
    localStorage.recordPoints = this.recordPoints;
  }
};

Game.prototype.paintLifes = function() {
  this.arrayLifes.forEach(function(element) {
    element.draw();
  });
};

Game.prototype.paintShoot = function(i, impact, weaponSelect) {
  if (weaponSelect === 0 && this.weaponsShoot[i].y < 3) {
    this.weaponsShoot[i].y += 3;
    this.weaponsShoot[i].draw();
    if (impact === true) {
      this.weaponsShoot.splice(i, 1);
    }
  } else {
    if (this.weaponsShoot[i].y <= 0 || impact === true) {
      this.weaponsShoot.splice(i, 1);
    } else {
      this.weaponsShoot[i].draw();
    }
  }
};

Game.prototype.paintBaloons = function(beginCountdown, option) {
  if (beginCountdown) {
    this.arrayBaloons.forEach(function(element) {
      element.draw();
    });
  } else {
    this.arrayBaloons.forEach(function(element, index, array) {
      if (option === 5 && this.optionCounter > 0) {
        element.draw();
      } else if (option === 6 && this.optionCounter > 0) {
        element.gravity = 0;
        element.updateBaloon();
      } else {
        element.gravity = 0.1;
        element.updateBaloon();
      }
    }.bind(this));
  }

};
Game.prototype.apllyOptions = function (option) {
  if (option === 3) {
    this.arrayBaloons.splice(Math.floor(Math.random() * this.arrayBaloons.length), 1);
    this.arrayBaloons.splice(Math.floor(Math.random() * this.arrayBaloons.length), 1);
    this.arrayBaloons.splice(Math.floor(Math.random() * this.arrayBaloons.length), 1);
    option = 0;
  } else if (option === 4) {
    this.player.speed = 4;
    option = 0;
  } else if (option === 5 && this.optionCounter > 0) {
    this.ctx.font = 'bold 70px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(Math.floor(this.optionCounter / 80), 300, 120);
    this.optionCounter--;
  } else if (option === 6 && this.optionCounter > 0) {
    this.ctx.font = 'bold 70px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(Math.floor(this.optionCounter / 80), 300, 120);
    this.optionCounter--;
  } else if (option === 7) {
    if (this.arrayLifes.length === 1) {
      this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 530, 30, 7));
    } else if (this.arrayLifes.length === 2) {
      this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 570, 30, 7));
    } else if (this.arrayLifes.length === 3) {
      this.arrayLifes.push(new Options(this.canvas, "./images/options2.png", 610, 30, 7));
    }
    option = 0;
  }
  if (option === 0) {
    this.optionSelected = 0;
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

Game.prototype.keyDown = function() {
  if (!this.isDead)
    this.player.onKeyDown();
};
Game.prototype.keyUp = function() {
  this.player.onKeyUp();
};

Game.prototype.shootAndCHeckColisionWithBalls = function(bool) {
  if (bool) {
    this.player.shoot = false;
    if (this.maxShoots !== this.weaponsShoot.length) {
      this.soundsAndEffects("shoot");
      this.weaponsShoot.push(new Weapon(this.canvas, "./images/weapons2.png",
        this.player.x, this.player.y, this.weaponSelect));
    }
  }
  var impact = false;
  for (var i = 0; i < this.weaponsShoot.length; i++) {
    this.arrayBaloons.forEach((function(element, index, array) {
      if (this.weaponColision(element, i, index, array)) {
        //Split ball in two or delete it
        this.points += 10;
        this.soundsAndEffects("ballColision");
        this.dividedBaloon(element, index, array);
        impact = true;
      }
    }).bind(this));
    this.paintShoot(i, impact, this.weaponSelect);
  }
};

Game.prototype.weaponColision = function(element, i, index, array) {
  var colision = false;
  //COLISION VERTICAL
  // If not Sub Machine Gun
  if (this.weaponSelect !== 3) {
    if (this.weaponsShoot[i].y < element.y + Math.floor(element.width)) {
      if ((Math.floor(element.x) === (this.weaponsShoot[i].x + Math.floor(this.weaponsShoot[i].widthFrame) - 10))) {
        // alert("COL VERTICAL Derecha");
        colision = true;
      }
      if ((this.weaponsShoot[i].x + 10 === (Math.floor(element.x) + Math.floor(element.width)))) {
        // alert("COL VERTICAL Izquierda");
        colision = true;
      }
    }
    //COLISON FRONTAL
    //primero comprueba que el y de la bola y player coincidan +-6
    if ((this.weaponsShoot[i].y <= (element.y + element.height))) {
      for (var j = 10; j <= this.weaponsShoot[i].widthFrame; j++) {
        if (this.weaponsShoot[i].x + j > element.x) {
          if (this.weaponsShoot[i].x + j <= element.x + Math.floor(element.width) + 2) {
            // alert("Frontal colision");
            colision = true;
            break;
          }
        }
      }
    }
  } else {
    //COLISON FRONTAL
    //primero comprueba que el y de la bola y player coincidan +-6
    if ((this.weaponsShoot[i].y <= (element.y + element.height)) &&
      (this.weaponsShoot[i].y >= (element.y + element.height - 6))) {
      //Calcula para cada pixel del arma x si esta entre la bola, si esta hay colisión
      for (var g = 20; g <= this.weaponsShoot[i].widthFrame; g++) {
        if (this.weaponsShoot[i].x + g > element.x) {
          if (this.weaponsShoot[i].x + g <= element.x + Math.floor(element.width) + 2) {
            // alert("Frontal colision");
            colision = true;
            break;
          }
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
      // alert("COL VERTICAL Izquierda");
    }
    if ((element.x === (this.player.x + Math.floor(this.player.widthFrame) - 10))) {
      isColision = true;
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
          isColision = true;
          break;
          // alert("COL FRONTAL");
        }
      }
    }
  }
  return isColision;
};

Game.prototype.dividedBaloon = function(element, index, array) {
  if (element.sprite.scale === 0.5) {
    array.splice(index, 1);
  } else {
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",
      (element.x + element.radius + 10), (element.y - 20), (element.sprite.scale - 0.5), 1, -2));
    this.arrayBaloons.push(new Baloon(this.canvas, "./images/baloon1.png",
      (element.x + element.radius - 10), (element.y - 20), (element.sprite.scale - 0.5), -1, -2));
    array.splice(index, 1);
    //CREATE AN OPTION BOX
    if (Math.floor(Math.random() * 3) === 1) {
      this.arrayOptionsBox.push(new Options(this.canvas, "./images/options2.png", element.x, element.y,// 4));
      Math.floor(Math.random() * 8)));
    }
  }
};

Game.prototype.pickAnOptionBox = function(element, index, array) {
  switch (element.sprite.frameIndex) {
    case 0:
      this.weaponSelect = 1;
      this.maxShoots = 2;
      this.optionSelected = 0;
      this.points += 10;
      array.splice(index, 1);
      break;
    case 1:
      this.weaponSelect = 3;
      this.maxShoots = 15;
      this.optionSelected = 1;
      this.points += 10;
      array.splice(index, 1);
      break;
    case 2:
      this.weaponSelect = 0;
      this.maxShoots = 1;
      this.optionSelected = 2;
      this.points += 10;
      array.splice(index, 1);
      break;
    case 3:
      //dinamite
      this.optionSelected = 3;
      this.points += 10;
      array.splice(index, 1);
      break;
    case 4:
      //Sonic speed
      this.optionSelected = 4;
      this.points += 20;
      this.soundsAndEffects("speedUp");
      array.splice(index, 1);
      break;
    case 5:
      //ball stop
      this.optionSelected = 5;
      this.optionCounter = 900;
      this.points += 20;
      array.splice(index, 1);
      break;
    case 6:
      //crazy gravity
      this.optionSelected = 6;
      this.optionCounter = 900;
      this.points += 30;
      array.splice(index, 1);
      break;
    case 7:
      //life
      this.optionSelected = 7;
      this.points += 50;
      array.splice(index, 1);
      break;
    default:
      this.optionSelected = "";
  }
};



Game.prototype.soundsAndEffects = function(val) {
  switch (val) {
    case "stage1":
      var audio = document.getElementById('music');
      var source = document.getElementById('music-source');
      source.setAttribute("src", "./sounds/stage1.mp3");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "stage2":
      audio = document.getElementById('music');
      source = document.getElementById('music-source');
      source.setAttribute("src", "./sounds/stage2.mp3");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "stage3":
      audio = document.getElementById('music');
      source = document.getElementById('music-source');
      source.setAttribute("src", "./sounds/stage3.mp3");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "continue":
      if (this.over.countdown === 870) {
        audio = document.getElementById('music');
        source = document.getElementById('music-source');
        source.setAttribute("src", "./sounds/continue.mp3");
        audio.load(); //call this to just preload the audio without playing
        audio.play(); //call this to play the song right away
      }
      break;
    case "gameOver":
      if (this.over.countdown === 80) {
        this.over.countdown--;
        audio = document.getElementById('music');
        source = document.getElementById('music-source');
        source.setAttribute("src", "./sounds/gameOver.mp3");
        audio.load(); //call this to just preload the audio without playing
        audio.play(); //call this to play the song right away
      }
      break;
    case "intro":
      audio = document.getElementById('music');
      source = document.getElementById('music-source');
      source.setAttribute("src", "./sounds/intro.mp3");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "speedUp":
      audio = document.getElementById('music');
      source = document.getElementById('music-source');
      source.setAttribute("src", "./sounds/speedUp.mp3");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "stageClear":
      if (this.win.countdown === 870) {
        audio = document.getElementById('music');
        source = document.getElementById('music-source');
        source.setAttribute("src", "./sounds/stageClear.mp3");
        audio.load(); //call this to just preload the audio without playing
        audio.play(); //call this to play the song right away
      }
      break;
    case "ballColision":
      audio = document.getElementById('effects');
      source = document.getElementById('effects-source');
      source.setAttribute("src", "./sounds/ballColision.wav");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "dead":
      audio = document.getElementById('effects');
      source = document.getElementById('effects-source');
      source.setAttribute("src", "./sounds/dead.wav");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "optionBox":
      audio = document.getElementById('effects');
      source = document.getElementById('effects-source');
      source.setAttribute("src", "./sounds/optionBox.wav");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    case "shoot":
      audio = document.getElementById('effects');
      source = document.getElementById('effects-source');
      source.setAttribute("src", "./sounds/shoot.wav");
      audio.load(); //call this to just preload the audio without playing
      audio.play(); //call this to play the song right away
      break;
    default:
  }
};
