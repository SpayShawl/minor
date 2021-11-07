import Controller from "../controllers/Controller";

export type SquareState = 'unknown' | 'discover' | 'marked';
export type SquareSize = 'default' | 'small';

export default class Square {
  line: number;
  column: number;

  constructor(line:number, column:number) {
    this.line = line;
    this.column = column;
  }

  /**
   * Get the border style of a position
   */
  getBorders():string {
    let border:string = "border-";

    if (this.line === 0) {
      border += "top-";
    }
    if (this.line === Controller.maxLine - 1) {
      border += "bottom-";
    }
    if (this.column === 0) {
      border += "left-";
    }
    if (this.column === Controller.maxColumn - 1) {
      border += "right-";
    }

    return border !== "border-" ? border.slice(0, -1) : "";
  }

  /**
   * Return all square in range
   */
  getSquaresInRange(self:boolean):Square[] {
    const range:Square[] = [];

    if (self) range.push(new Square(this.line, this.column));
    for (let i = -1; i < 2; i += 2) {
      range.push(new Square(this.line + i, this.column + i));
      range.push(new Square(this.line + i, this.column));
      range.push(new Square(this.line + i, this.column - i));
      range.push(new Square(this.line, this.column - i));
    }

    return range.filter(
      (square) =>
        square.line >= 0 &&
        square.column >= 0 &&
        square.line < Controller.maxLine &&
        square.column < Controller.maxColumn
    );
  }

  /**
   * Return if the square is in range
   */
  isInRange(squares:Square[]):boolean {
    let isInRange:boolean = false;

    squares.forEach((square) => {
      if (!isInRange && square.line === this.line && square.column === this.column) {
        isInRange = true;
      }
    });

    return isInRange;
  }

  /**
   * Return true if the square is a bomb
   */
  isBomb(bombs: Square[]):boolean {
    let isBomb:boolean = false;
    
    bombs.forEach((bomb) => {
      if (
        !isBomb &&
        bomb.line == this.line &&
        bomb.column == this.column
      ) {
        isBomb = true;
      }
    });

    return isBomb;
  }
}
