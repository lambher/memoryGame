import Game from "./game.js"
import * as Conf from './conf.js'
import Cookie from "./cookies.js";

var canvas = document.getElementById('canvas');
var saveButton = document.getElementById('save');
var scoreButton = document.getElementById('score');
var signinButton = document.getElementById('signin');
var modal = document.getElementById("modal");
var modalScore = document.getElementById("modal-score");
var myScore = document.getElementById("my_score");
var span = document.getElementsByClassName("close")[0];
var spanScore = document.getElementsByClassName("close")[1];
var toggle = document.getElementById('mute');
var scoreList = document.getElementById('score-list');
var ctx = canvas.getContext('2d');

const cookie = new Cookie();

const game = new Game(cookie);

ctx.canvas.width  = Conf.WINDOW_X;
ctx.canvas.height = Conf.WINDOW_Y;

canvas.addEventListener('click', onCanvasClick, false);
scoreButton.addEventListener('click', showHighScore, false);
saveButton.addEventListener('click', saveHighScore, false);
toggle.addEventListener('click', toggleMusic, false);
signinButton.addEventListener('click', signin, false);
span.onclick = function() {
    modal.style.display = "none";
}
spanScore.onclick = function() {
    modalScore.style.display = "none";
}
window.onclick = function(event) {
    myScore.innerHTML = "Your best score : " + game.getHighScore().toString();
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target == modalScore) {
        modalScore.style.display = "none";
    }
}

function showHighScore() {
    modalScore.style.display = "block";
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

    createAccount(name.value, email.value, password.value, game.getHighScore());
}

loadScores();

setInterval(loadScores, 10000);


function loadScores() {
    // $.ajax({
    //     type: "GET",
    //     url: "http://memorygame.uno:7766/scores",
    //     dataType: "json"
    //   });

      var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
      var theUrl = "http://memorygame.uno:7766/scores";
      xmlhttp.open("GET", theUrl);
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200 && this.response !== "not found") {
              const scores = JSON.parse(this.response);
              scoreList.innerHTML = "";
              scores.forEach(score => {
                  scoreList.innerHTML += "<li>"+ score.user[0].name + " : " + Math.round(score.score).toString() + "</li>"
              });
  
          }
      }
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttp.send();
}

function createAccount(name, email, password, score, callBack) {
    const data = {
        name: name,
        email: email,
        password: password,
        max_score: score
    };

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    var theUrl = "http://memorygame.uno:7766/connect";
    xmlhttp.open("POST", theUrl);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && this.response !== "not found") {
            const resp = JSON.parse(this.response);
            game.token = resp.token;
            cookie.set("token", resp.token, 999999);
            modal.style.display = "none";
        }
    }
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(data));

    // $.ajax({
    //     type: "POST",
    //     url: "http://memorygame.uno:7766/connect",
    //     data: JSON.parse(JSON.stringify(data)),
    //     dataType: "json",
    //     contentType: "application/json"
    //   });
}

let token = cookie.get("token");

if (token) {
    saveButton.style.display = "none";
    game.token = token;
    console.log(game.token);
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