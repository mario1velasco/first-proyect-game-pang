var Y_KEY = 89;
var game;
window.onload = function() {
  function startGame() {
    game = new Game("canvas-fb", 640, 480);
    game.loadValues();
    game.draw();
  }
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  startGame();

  document.addEventListener("keydown", onKeyDown, false);

  function onKeyDown() {
    if (event.keyCode == Y_KEY) {
      game=undefined;
      game = new Game("canvas-fb", 640, 480);
      game.loadValues();
      game.draw();
    }
  }
};
