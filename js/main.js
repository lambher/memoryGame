import Game from "./game.js"
import * as Conf from './conf.js'
import Cookie from "./cookies.js";

var canvas = document.getElementById('canvas');
var saveButton = document.getElementById('save');
var signinButton = document.getElementById('signin');
var modal = document.getElementById("modal");
var myScore = document.getElementById("my_score");
var span = document.getElementsByClassName("close")[0];
var toggle = document.getElementById('mute');
var ctx = canvas.getContext('2d');

const cookie = new Cookie();

const game = new Game(cookie);

ctx.canvas.width  = Conf.WINDOW_X;
ctx.canvas.height = Conf.WINDOW_Y;

canvas.addEventListener('click', onCanvasClick, false);
saveButton.addEventListener('click', saveHighScore, false);
toggle.addEventListener('click', toggleMusic, false);
signinButton.addEventListener('click', signin, false);
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    myScore.innerHTML = "Your best score : " + game.getHighScore().toString();
    if (event.target == modal) {
      modal.style.display = "none";
    }
}


function toggleMusic() {
    game.toggleMusic();
    if (game.musicOn) {
        toggle.innerHTML = "Stop music";
    } else {
        toggle.innerHTML = "Play music";
    }
}

function signin() {
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    console.log("signin " + name.value);

    createAccount(name.value, email.value, password.value, game.getHighScore(), (res) => {
        console.log(res);

        modal.style.display = "none";
    });


}

function createAccount(name, email, password, score, callBack) {
    const data = {
        name: name,
        email: email,
        password: password,
        score: score,
    };

    $.ajax({
        type: "POST",
        url: "https://memorygame.uno/create",
        data: data,
        dataType: "json"
      });
}

function saveHighScore() {
    let token = cookie.get("token");

    if (!token) {
        modal.style.display = "block";
    }

    console.log(game.getHighScore());
}


function update(progress) {
    game.update(progress);
}

function draw() {
    game.draw(ctx);
}

function loop(timestamp) {
    var progress = timestamp - lastRender;
  
    update(progress);
    draw();
  
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }

var lastRender = 0;
window.requestAnimationFrame(loop);

function onCanvasClick(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
        x = e.pageX;
        y = e.pageY;
    }
    else { 
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    game.click(x, y, ctx);
}