import Circle, {SIZE} from "./circle.js";
import * as Conf from './conf.js'

export default class Game {
    constructor() {
        this.background = "#FFFFFF";
        this.circles = [];
        this.startGame();
    }

    startGame() {
        for (let i = 1; i <= 5; i++) {
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
        // console.log(progress);
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.circles.forEach((circle) => {
            circle.draw(ctx);
        });
    }

    drawBackground(ctx) {
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, Conf.WINDOW_X, Conf.WINDOW_Y);
    }


}