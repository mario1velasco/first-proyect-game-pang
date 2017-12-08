var Y_KEY = 89;
var game;
window.onload = function() {
  function startGame() {
    game = new Game("canvas-fb", 640, 480);
    game.draw();
  }
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  startGame();

  document.addEventListener("keydown", onKeyDown, false);
  // document.addEventListener("keyup", onKeyUp, false);

  function onKeyDown() {
    if (event.keyCode == Y_KEY) {
      // this.isDead=false;
      debugger
      game=undefined;

      // game = new Game("canvas-fb", 640, 480);
      // game.draw();
    }
  }
};

/*
var Y_KEY = 89;

window.onload = function() {
  // var game = new Game("canvas-fb", 640, 480);
  // game.draw();
  var script = new Script();
};

function Script(){
  debugger
  this.game=new Game("canvas-fb", 640, 480);
  document.onkeydown = this.onKeyDown.bind(this);
  document.onkeyup = this.onKeyUp.bind(this);
  // document.addEventListener("keydown", onKeyDown, false);
  // document.addEventListener("keyup", onKeyUp, false);
  document.getElementById("start-button").onclick = function() {
    this.startGame();
  };
  this.game.draw();
}

Script.prototype.startGame = function () {
  this.game=new Game("canvas-fb", 640, 480);
  this.game.draw();
};

Script.prototype.onKeyDown = function () {
  debugger
  if (this.game.isDead) {
    if (event.keyCode == Y_KEY) {
      // this.isDead=false;
      var game = new Game("canvas-fb", 640, 480);
      this.game.draw();
      //this.isDead=false;
    }
  } else {
    this.game.player.onKeyDown();
  }
};

Script.prototype.onKeyUp = function () {
  this.game.player.onKeyUp();
};

*/
