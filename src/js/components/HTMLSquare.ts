import { SquareSize, SquareState } from "../metier/Square";

export default class HTMLSquare {
    state: SquareState;
    size: SquareSize;
    borders: string;
    x: number;
    y: number;

    constructor(state:SquareState, size: SquareSize, borders: string, x:number, y:number){
        this.state = state;
        this.size = size;
        this.borders = borders;
        this.x = x;
        this.y = y;
    }

    create(): HTMLDivElement{
        const squareHtml = document.createElement("div");
        squareHtml.id = `${this.x}-${this.y}`;
        squareHtml.className = `square ${this.size} ${this.state} ${this.borders}`;
        squareHtml.dataset.line = this.x.toString();
        squareHtml.dataset.column = this.y.toString();

        squareHtml.appendChild(document.createElement("span"));
        squareHtml.appendChild(this.addValue());

        return squareHtml;
    }

    addValue(): HTMLParagraphElement{
        const value = document.createElement("p");
        value.className = "value";

        return value;
    }
}