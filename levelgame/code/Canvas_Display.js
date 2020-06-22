function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}
var scale = 20;
function CanvasDisplay(parent, level) {
  this.canvas = document.createElement("canvas");
  this.canvas.className = "imgbox";
  // this.canvas.style.display = block;
  // console.log(this.canvas.style);
  this.canvas.width = Math.min(650, level.width * scale);
  this.canvas.height = Math.min(450, level.height * scale);
  parent.appendChild(this.canvas);
  this.cx = this.canvas.getContext("2d");

  this.level = level;
  this.animationTime = 0;
  this.flipPlayer = false;
  this.flipEnemy = false;

  this.viewport = {
    left: 0,
    top: 0,
    width: this.canvas.width / scale,
    height: this.canvas.height / scale
  };
  this.drawFrame(0);
}

CanvasDisplay.prototype.clear = function () {
  this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.drawFrame = function (step) {
  this.animationTime += step;
  this.updateViewport();
  this.clearDisplay();
  this.drawBackground();
  this.drawActors();
};
CanvasDisplay.prototype.updateViewport = function () {
  var view = this.viewport, margin = view.width / 3;
  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin)
    view.left = Math.max(center.x - margin, 0);
  else if (center.x > view.left + view.width - margin)
    view.left = Math.min(center.x + margin - view.width, this.level.width - view.width);
  if (center.y < view.top + margin)
    view.top = Math.max(center.y - margin, 0);
  else if (center.y > view.top + view.height - margin)
    view.top = Math.min(center.y + margin - view.height, this.level.height - view.height);

}

CanvasDisplay.prototype.clearDisplay = function () {
  if (this.level.status == "won")
    this.cx.fillStyle = "rgb(68,191,255)";
  else if (this.level.status == "lost")
    this.cx.fillStyle = "rgb(52, 166, 166)";
  else
    this.cx.fillStyle = "rgb(52, 166, 251)"
  this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};
var otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function () {
  var view = this.viewport;
  var xStart = Math.floor(view.left);
  var xEnd = Math.ceil(view.left + view.width);
  var yStart = Math.floor(view.top);
  var yEnd = Math.ceil(view.top + view.height);

  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var tile = this.level.grid[y][x];
      if (tile == null) continue;
      var screenX = (x - view.left) * scale;
      var screenY = (y - view.top) * scale;
      // var tileX = tile == "lava" ? scale : 0;
      if (tile == "wall") {
        tileX = 0;
      } else if (tile == "river") {
        tileX = scale * 2;
      } else if (tile == "lava") {
        tileX = scale;
      } else if (tile == "destination") {
        tileX = scale * 3;
      }
      this.cx.drawImage(otherSprites,
        tileX, 0, scale, scale,
        screenX, screenY, scale, scale);
    }
  }
};

var playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
var unmatchedPlayerSprites = document.createElement("img");
unmatchedPlayerSprites.src = "img/unmatched_player.png";
var playerXOverlap = 4;

CanvasDisplay.prototype.drawPlayer = function (x, y, width, height) {
  var sprite = 8, player = this.level.player;
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x != 0)
    this.flipPlayer = player.speed.x < 0;

  if (player.speed.y != 0)
    sprite = 9;
  else if (player.speed.x != 0)
    sprite = Math.floor(this.animationTime * 12) % 8;

  this.cx.save();
  if (this.flipPlayer)
    flipHorizontally(this.cx, x + width / 2);
  try {
    this.cx.drawImage((this.level.unmatched ? unmatchedPlayerSprites : playerSprites),
      sprite * width, 0, width, height,
      x, y, width, height);
  } catch (error) {
    console.log(error);
  }
  this.cx.restore();
};


var enemySprites = document.createElement("img");
enemySprites.src = "img/enemy.png";
var enemyXOverlap = 4;
CanvasDisplay.prototype.drawEnemy = function (x, y, width, height, enemy) {
  var sprite = 8;
  width += enemyXOverlap * 2;
  x -= enemyXOverlap;
  if (enemy.speed.x != 0)
    this.flipEnemy = enemy.speed.x < 0;

  if (enemy.speed.y != 0)
    sprite = 9;
  else if (enemy.speed.x != 0)
    sprite = Math.floor(this.animationTime * 12) % 8;

  this.cx.save();
  if (this.flipEnemy)
    flipHorizontally(this.cx, x + width / 2);

  this.cx.drawImage(enemySprites,
    sprite * width, 10, width, height,
    x, y, width, height);
  this.cx.restore();
}


CanvasDisplay.prototype.drawActors = function () {
  this.level.actors.forEach(function (actor) {
    var width = actor.size.x * scale;
    var height = actor.size.y * scale;
    var x = (actor.pos.x - this.viewport.left) * scale;
    var y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(x, y, width, height);
    } else if (actor.type == "enemy") {
      this.drawEnemy(x, y, width, height, actor);
    } else {
      if (actor.type == "coin") {
        tileX = 5 * scale;
      } else if (actor.type == "lava") {
        tileX = scale;
      } else if (actor.type == "bullet") {
        tileX = 5 * scale + 12;
      } else if (actor.type == "dodgeball") {
        tileX = 4 * scale
      } else {
        tileX = 3 * scale;
      }
      try {
        this.cx.drawImage(otherSprites,
          tileX, 0, width, height,
          x, y, width, height);
      } catch (error) {
        console.log(error);
      }
    }
  }, this);
};