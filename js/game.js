import Circle, {SIZE} from "./circle.js";
import * as Conf from './conf.js'

export default class Game {
    constructor() {
        this.background = "#FFFFFF";
        this.startGame();
    }

    startGame() {
        this.level = 1;
        this.score = 0;
        this.reloadCircles();
    }

    reloadCircles() {
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
        this.point -= progress / 100;
        console.log(progress);
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.circles.forEach((circle) => {
            circle.draw(ctx);
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
    }

    drawBackground(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, Conf.WINDOW_X, Conf.WINDOW_Y);
    }


}