import Game from "./game.js"
import * as Conf from './conf.js'

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

const game = new Game();

ctx.canvas.width  = Conf.WINDOW_X;
ctx.canvas.height = Conf.WINDOW_Y;

function update(progress) {
    game.update(progress);
}

function draw() {
    game.draw(ctx);
}

function loop(timestamp) {
    var progress = timestamp - lastRender
  
    update(progress)
    draw()
  
    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }

var lastRender = 0
window.requestAnimationFrame(loop)