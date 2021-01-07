export const SIZE = 50;

export default class Square {
    constructor(position, number) {
        this.size = SIZE;
        this.color = "#00FF00";
        this.position = position;
        this.number = number;
    }

    colides(x, y) {
        return x > this.position.x && x < this.position.x + this.size && y > this.position.y && y < this.position.y + this.size;
    }

    draw(ctx, visible) {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);

        if (visible) {
            ctx.fillStyle = "#000000";
            ctx.font = (this.size / 2).toString() + 'px serif';
            ctx.fillText(this.number.toString(), this.position.x + this.size / 2 - this.size / 8, this.position.y + this.size / 2 + this.size / 8);
        }
    }
    
}