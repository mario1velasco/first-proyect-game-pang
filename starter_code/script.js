var Y_KEY = 89;
var game;
window.onload = function() {
  function startGame() {
    game = new Game("canvas-fb", 640, 480);
    game.loadValues();
    game.draw();
  }
  startGame();
};
