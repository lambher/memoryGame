import Square, {SIZE} from "./square.js";
import * as Conf from './conf.js'

export default class Game {
    constructor(cookie) {
        this.loadSound();
        this.musicOn = true;
        this.musicStarted = false;
        this.cookie = cookie;
        this.background = "#000000";
        this.lastScore = 0;
        this.startGame();
    }

    loadSound() {
        this.clickSound = new Audio('./assets/sounds/click.mp3');
        this.winSound = new Audio('./assets/sounds/win.mp3');
        this.looseSound = new Audio('./assets/sounds/loose.mp3');
        this.loadMusic();
       
    }

    loadMusic() {
        const nb = Math.round(Math.random() * 5);
        const path = './assets/sounds/music'+ nb.toString() + '.mp3';
        console.log(path);
        this.gameSong = new Audio(path);
        this.gameSong.volume = 0.1;
       
    }

    startMusic() {
        this.musicStarted = true;
        var self = this;
        this.gameSong.addEventListener("ended", function(){
            self.loadMusic();
            self.startMusic();
       });
       this.gameSong.play();
    }

    toggleMusic() {
        this.musicOn = !this.musicOn;
        if (this.musicOn) {
            this.startMusic();
        } else {
            this.gameSong.addEventListener("ended", function(){
            });
             this.gameSong.pause();
        }

       
    }

    getHighScore() {
        return Math.round(this.best);
    }

    startGame() {
        this.best = 0;
        this.loadStats();

        this.level = 1;
        this.score = 0;
        this.reloadSquares();
    }

    reloadSquares() {
        this.currentNumber = 1;
        this.visible = true;
        this.point = 100 +  Math.round(this.level / 5) * 50;
        this.squares = [];
        const maxSquare = 4 + Math.round(this.level / 5);
        for (let i = 1; i <= maxSquare; i++) {
            this.squares.push(new Square(this.getRandomPosition(), i))
        }
    }

    getRandomPosition() {
        const x = Math.random() * (Conf.WINDOW_X - SIZE * 4) + SIZE;
        const y = Math.random() * (Conf.WINDOW_Y - SIZE * 4) + SIZE;
        if (this.collideWithUI(x, y)) {
            return this.getRandomPosition();
        }
        if (this.collideWithSquare(x, y)) {
            return this.getRandomPosition();
        }   
        return {x: x, y: y};
    }

    collideWithUI(x, y) {
        return x < 150 & y < 170
    }

    collideWithSquare(x, y) {
        for (let i = 0; i < this.squares.length; i++) {
            const square = this.squares[i];
            if (square.colides(x,y) || square.colides(x + SIZE,y + SIZE) || square.colides(x + SIZE,y) || square.colides(x,y + SIZE)) {
                return true;
            }
        }
     
        return false;
    }

    update(progress) {
        this.point -= progress / 100;
        if (this.point <= 0) {
            this.point = 0;
        }
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.squares.forEach((square) => {
            square.draw(ctx, this.visible);
        });
        this.drawUI(ctx);
    }

    drawUI(ctx) {
        ctx.fillStyle = "#00FF00";
        ctx.font = '100 px serif';
        ctx.fillText("Point : +" + Math.round(this.point.toString()), 5, 40);
        
        ctx.fillStyle = "#00FF00";
        ctx.font = '100 px serif';
        ctx.fillText("Score : " + Math.round(this.score.toString()), 5, 80);

        ctx.fillStyle = "#00FF00";
        ctx.font = '100 px serif';
        ctx.fillText("Last : " + Math.round(this.lastScore.toString()), 5, 120);

        ctx.fillStyle = "#00FF00";
        ctx.font = '100 px serif';
        ctx.fillText("Best : " + Math.round(this.best.toString()), 5, 160);
    }

    drawBackground(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, Conf.WINDOW_X, Conf.WINDOW_Y);
    }

    click(x, y, ctx) {
        for (let i = 0; i < this.squares.length; i++) {
            const square = this.squares[i];
            if (square.colides(x, y)) {
                if (!this.musicStarted) {
                    this.startMusic();
                }
                if (square.number === this.currentNumber) {
                    if (this.currentNumber === 1) {
                        this.visible = false;
                    }
                    this.squares.splice(i, 1);
                    this.currentNumber++;
                    this.checkWin();
                } else {
                    this.loose();
                }
                return ;
            }
        }      
    }

    loose() {
        if (this.score > this.best) {
            this.best = this.score;
        }
        this.looseSound.play();
        this.saveStats();
        this.level = 1;
        this.lastScore = this.score ? this.score : this.lastScore;
        this.score = 0;
        this.reloadSquares();
    }

    checkWin() {
        if (this.squares.length === 0) {
            this.level++;
            this.score += this.point;
            if (this.score > this.best) {
                this.best = this.score;
            }
            this.winSound.play();
            this.saveStats();
            this.reloadSquares();
        } else {
            this.clickSound.play();
        }
    }

    saveStats() {
        this.cookie.set("best", this.best, 99999);
    }

    loadStats() {
        const value = this.cookie.get("best");
        if (value) {
            this.best = value;
        }
    }

}
