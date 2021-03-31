import Square from "../metier/Square";
import { getUniqBomb } from "../utils/Utils";
import ChronoController from "./ChronoController";
import ClickController from "./ClickController";
import ThemeController from "./ThemeController";
import FlagController from "./FlagController";
import DifficultyController from "./DifficultyController";
import Ctrl from "../-.- --- -. .- --/-.-. - .-. .-..";

export default class Controller {
  static bombs = [];
  static maxLine = 0;
  static maxColumn = 0;
  static nbBombs = 0;

  /**
   * Represent the main controller
   * @return {Controller}
   */
  constructor() {
    this.grid = document.getElementById("grid");
    this.flagsPosed = 0;
    this.playing = true;
    this.chrono = new ChronoController();
    this.clickController = new ClickController(this);

    this.loadControllers();
    this.registerListeners();
  }

  /**
   * Load all other controllers
   * @return {void}
   */
  loadControllers() {
    new ThemeController();
    new FlagController();
    new DifficultyController(this);
    new Ctrl();
  }

  registerListeners() {
    document
      .getElementById("reset")
      .addEventListener("click", this.reset.bind(this));
  }

  /**
   * Load and create the grid
   * @return {void}
   */
  loadGame() {
    for (let i = 0; i < Controller.maxLine; i++) {
      const htmlLine = document.createElement("div");
      htmlLine.className = "line";
      for (let j = 0; j < Controller.maxColumn; j++) {
        const squareHtml = document.createElement("div");
        const span = document.createElement("span");
        const value = document.createElement("p");
        value.className = "value";
        const square = new Square(i, j);

        squareHtml.id = `${i}-${j}`;
        squareHtml.dataset.line = i.toString();
        squareHtml.dataset.column = j.toString();
        squareHtml.className = `square unknown ${square.getBorders()}`;
        squareHtml.appendChild(span);
        squareHtml.appendChild(value);
        htmlLine.appendChild(squareHtml);
      }
      this.grid.appendChild(htmlLine);
    }
    this.updateBombsNumber();
  }

  /**
   * Reset the grid
   * @return {void}
   */
  reset() {
    this.grid.innerHTML = "";
    this.chrono.resetChrono();
    this.playing = true;
    this.flagsPosed = 0;
    Controller.bombs = [];
    this.clickController.click = new Square(undefined, undefined);
    this.grid.style.opacity = "100%";
    document.getElementById("end").style.opacity = "0";
    this.loadGame();
  }

  /**
   * Check if the game is won
   * @return {void}
   */
  checkWin() {
    if (Controller.nbBombs === this.flagsPosed) {
      const unknowns = document.querySelectorAll(".unknown");
      let isAllBombs = true;
      unknowns.forEach((unknown) => {
        const square = new Square(unknown.dataset.line, unknown.dataset.column);
        if (isAllBombs && !square.isBomb()) {
          isAllBombs = false;
        }
      });
      if (isAllBombs) {
        document.getElementById("end").textContent = "TE PRAEPOSSUM";
        this.finishGame();
      }
    }
  }

  /**
   * Place a flag at the position
   * @param click {Square}
   * @return {void}
   */
  placeFlag(click) {
    const htmlSquare = document.getElementById(`${click.line}-${click.column}`);
    if (
      !htmlSquare.className.includes("opened") &&
      !htmlSquare.className.includes("flag")
    ) {
      this.flagsPosed++;
      htmlSquare.className += " flag";
      htmlSquare.children[1].textContent = "";
    } else if (htmlSquare.className.includes("flag")) {
      this.flagsPosed--;
      htmlSquare.className = htmlSquare.className.replace(" flag", "");
      htmlSquare.children[1].textContent = "";
    }
    this.updateBombsNumber();
  }

  /**
   * Update the number of bombs remaining
   * @return {void}
   */
  updateBombsNumber() {
    document.getElementById("nbBomb").textContent = `SPECUS : ${
      Controller.bombs.length - this.flagsPosed
    }`;
  }

  /**
   * Place all bombs around the target
   * @param target {HTMLDivElement}
   * @return {void}
   */
  createBombs(target) {
    const click = new Square(
      parseInt(target.dataset.line),
      parseInt(target.dataset.column)
    );

    for (let i = 0; i < Controller.nbBombs; i++) {
      Controller.bombs.push(getUniqBomb(Controller.bombs, click));
    }

    Controller.bombs = Controller.bombs.filter((bomb) => {
      const range = bomb
        .getSquaresInRange(true)
        .filter((b) => !b.isInRange(Controller.bombs));
      return range.length > 0;
    });

    this.chrono.startChrono();

    document.getElementById(
      "nbBomb"
    ).textContent = `SPECUS : ${Controller.bombs.length}`;
  }

  /**
   * Open the square recursively
   * @param square
   * @param bypass
   * @param isFinish
   * @return {Promise<void>}
   */
  async openSquare(square, bypass, isFinish) {
    const htmlSquare = document.getElementById(
      `${square.line}-${square.column}`
    );
    if (!square.isBomb()) {
      const squareInRange = square.getSquaresInRange(false);
      const closeBombs = squareInRange.filter((b) =>
        b.isInRange(Controller.bombs)
      );

      if (
        !htmlSquare.className.includes("opened") &&
        !htmlSquare.className.includes("flag")
      ) {
        htmlSquare.children[1].textContent =
          closeBombs.length > 0 ? closeBombs.length.toString() : "";
        htmlSquare.className = htmlSquare.className.replace("unknown", "");
        htmlSquare.className += " opened";
        if (closeBombs.length === 0) {
          squareInRange.forEach((s) => {
            this.openSquare(s, bypass, false);
          });
        }
      } else if (!bypass) {
        const closeFlag = squareInRange.filter((b) => {
          const bHtml = document.getElementById(`${b.line}-${b.column}`);
          return bHtml.className.includes("flag");
        });
        if (closeBombs.length > 0 && closeFlag.length === closeBombs.length) {
          squareInRange.forEach((s) => {
            this.openSquare(s, true, false);
          });
        }
      }
    } else if (!htmlSquare.className.includes("flag")) {
      htmlSquare.className = htmlSquare.className.replace("unknown", "");
      htmlSquare.className += " bomb";
      htmlSquare.children[1].textContent = "";
      if (!isFinish) {
        this.finishGame();
      }
    }
  }

  /**
   * Open all square remaining of the grid
   * @return {void}
   */
  openAllSquare() {
    for (let i = 0; i < Controller.maxLine; i++) {
      for (let j = 0; j < Controller.maxColumn; j++) {
        this.openSquare(new Square(i, j), true, true).then();
      }
    }
  }

  /**
   * Finish the game
   * @return {void}
   */
  finishGame() {
    this.playing = false;
    this.chrono.stopChrono();
    this.grid.style.opacity = "20%";
    document.getElementById("end").style.opacity = "100%";
    this.openAllSquare();
  }
}
