import Controller from "../controllers/Controller";

export default class Square {
  /**
   * Represent a position on the grid
   * @param line {number}
   * @param column {number}
   * @return {Square}
   */
  constructor(line, column) {
    this.line = line;
    this.column = column;
  }

  /**
   * Get the border style of a position
   * @return {string|string}
   */
  getBorders() {
    let border = "border-";
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
   * @return {Square[]}
   */
  getSquaresInRange(self) {
    const range = [];
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
   * @param range {Square[]}
   * @return {boolean}
   */
  isInRange(range) {
    let isInRange = false;
    range.forEach((a) => {
      if (!isInRange && a.line === this.line && a.column === this.column) {
        isInRange = true;
      }
    });
    return isInRange;
  }

  /**
   * Return true if the square is a bomb
   * @return {boolean}
   */
  isBomb() {
    let isBomb = false;
    Controller.bombs.forEach((bomb) => {
      if (
        !isBomb &&
        parseInt(bomb.line) === parseInt(this.line) &&
        parseInt(bomb.column) === parseInt(this.column)
      ) {
        isBomb = true;
      }
    });
    return isBomb;
  }
}
