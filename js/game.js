import Circle, {SIZE} from "./circle.js";
import * as Conf from './conf.js'

export default class Game {
    constructor() {
        this.background = "#FFFFFF";
        this.startGame();
    }

    startGame() {
        this.best = 0;
        this.loadStats();

        this.level = 1;
        this.score = 0;
        this.reloadCircles();
    }

    reloadCircles() {
        this.currentNumber = 1;
        this.visible = true;
        setTimeout(() => {
            this.visible = false;
        }, 2000);
        this.point = 100 +  Math.round(this.level / 5) * 50;
        this.circles = [];
        const maxCircle = 4 + Math.round(this.level / 5);
        for (let i = 1; i <= maxCircle; i++) {
            this.circles.push(new Circle(this.getRandomPosition(), i))
        }
    }

    getRandomPosition() {
        const x = Math.random() * (Conf.WINDOW_X - SIZE * 4) + SIZE;
        const y = Math.random() * (Conf.WINDOW_Y - SIZE * 4) + SIZE;
        if (this.collideWithCircle(x, y)) {
            return this.getRandomPosition();
        }   
        return {x: x, y: y};
    }

    collideWithCircle(x, y) {
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            if (circle.dist(x, y) < SIZE * 2) {
                return true;
            }
        }
     
        return false;
    }

    update(progress) {
        if (!this.visible) {
            this.point -= progress / 100;
        }
        if (this.point <= 0) {
            this.point = 0;
            this.loose();
        }
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.circles.forEach((circle) => {
            circle.draw(ctx, this.visible);
        });
        this.drawUI(ctx);
    }

    drawUI(ctx) {
        ctx.fillStyle = "#000000";
        ctx.font = '100 px serif';
        ctx.fillText("Point : +" + Math.round(this.point.toString()), 5, 40);
        
        ctx.fillStyle = "#000000";
        ctx.font = '100 px serif';
        ctx.fillText("Score : " + Math.round(this.score.toString()), 5, 80);

        ctx.fillStyle = "#000000";
        ctx.font = '100 px serif';
        ctx.fillText("Best : " + Math.round(this.best.toString()), 5, 120);
    }

    drawBackground(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, Conf.WINDOW_X, Conf.WINDOW_Y);
    }

    click(x, y, ctx) {
        if (this.visible) {
            return
        }
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            if (circle.colides(x, y)) {
                if (circle.number == this.currentNumber) {
                    this.circles.splice(i, 1);
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
        this.saveStats();
        this.level = 1;
        this.score = 0;
        this.reloadCircles();
    }

    checkWin() {
        if (this.circles.length === 0) {
            this.level++;
            this.score += this.point;
            if (this.score > this.best) {
                this.best = this.score;
            }
            this.saveStats();
            this.reloadCircles();
        }
    }

    saveStats() {
        setCookie("best", this.best, 99999);
    }

    loadStats() {
        const value = getCookie("best");
        if (value) {
            this.best = value;
        }
    }

}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}