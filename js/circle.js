export const SIZE = 20;

export default class Circle {
    constructor(position, number) {
        this.size = SIZE;
        this.color = "#555555";
        this.position = position;
        this.number = number;
    }

    dist(x, y) {
        const xa = Math.round(x);
        const xb = this.position.x;
        const ya = Math.round(y);
        const yb = this.position.y;

        return Math.sqrt(Math.pow((xb -xa), 2) + Math.pow((yb -ya), 2));
    }

    colides(x, y) {
        return this.dist(x, y) < this.size * 1.3;
    }

    draw(ctx, visible) {

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
        ctx.fill();

        if (visible) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = (SIZE).toString() + 'px serif';
            ctx.fillText(this.number.toString(), this.position.x - SIZE / 4, this.position.y + SIZE / 4);
        }
    }
    
}