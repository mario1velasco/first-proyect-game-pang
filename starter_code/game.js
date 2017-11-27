function Game(canvasId, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');

  this.bg = new Background(this.canvas, "./images/bg.png", this.width, this.height);
  this.baloon = new Baloon(this.canvas, "./images/baloon1.png");
  this.player = new Player(this.canvas, "./images/pang.png", 320/*this.width*/, this.height);


  //this.intervl =setInterval(this.addObstacle.bind(this), 3000);
  //this.points=0;
}

Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.draw = function() {
  this.clear();
  this.bg.draw();
  this.player.draw();
  this.baloon.updateBaloon();
  this.colision();
  window.requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.colision = function() {
  if(this.baloon.y>=this.player.y){
    if(this.player.x-(31)<this.baloon.x){
       if((this.player.x+(31)>this.baloon.x))
        alert("lATERAL crush");
    }
  }
};
