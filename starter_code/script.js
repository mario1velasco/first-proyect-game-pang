window.onload = function() {
  var game = new Game("canvas-fb",640,480);
  game.draw();
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  function startGame() {
    var game = new Game("canvas-fb",640,480);
    game.draw();

  }

};
