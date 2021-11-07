import Square, { SquareSize, SquareState } from "../metier/Square";
import { getClickbySeed, getEncryptions, getRandomSeed, getUniqBomb, playRandomMusic, playSound } from "../utils/Utils";
import ChronoController from "./ChronoController";
import ClickController from "./ClickController";
import ThemeController from "./ThemeController";
import FlagController from "./FlagController";
import DifficultyController from "./DifficultyController";
import KeyboardController from "./KeyboardController";
import confetti from "canvas-confetti";
import HTMLSquare from "../components/HTMLSquare";
import TextScramble from "../utils/Scramble";
export default class Controller {
  static bombs:Square[] = [];
  static maxLine = 0;
  static maxColumn = 0;
  static nbBombs = 0;
  static nbJoker = 0;

  seed?: string;
  grid: HTMLElement;
  flagsPosed: number;
  playing: boolean;
  chrono: ChronoController;
  clickController: ClickController;

  constructor() {
    this.grid = document.getElementById("grid");
    this.flagsPosed = 0;
    this.chrono = new ChronoController();
    this.clickController = new ClickController(this);

    this.loadControllers();
    this.registerListeners();
  }

  setSeed(newSeed: string){
    document.querySelector(".seed").textContent = newSeed;
    this.seed = newSeed;
    this.loadGame(undefined, this.seed);
  }

  loadControllers():void {
    new ThemeController();
    new FlagController();
    new DifficultyController(this);
    new KeyboardController(this);
  }

  registerListeners():void {
    document.getElementById("reset").addEventListener("click", this.loadGame.bind(this));
    document.querySelector(".seed").addEventListener("click", this.handleCopySeed.bind(this));
    document.querySelectorAll(".crypted").forEach(c => c.addEventListener('mouseover', this.decrypt.bind(this)));
    document.querySelectorAll(".crypted").forEach(c => c.addEventListener('mouseleave', this.crypt.bind(this)));
  }

  handleCopySeed(event:any):void {
    navigator.clipboard.writeText(event.srcElement.textContent);
  }

  decrypt(ev:any){
    const text = ev.target.textContent.split(" ")[0];
    new TextScramble(ev.target, getEncryptions(text));
  }

  crypt(ev: any){
    const text = ev.target.dataset.value || ev.target.textContent.split(" ")[0];
    new TextScramble(ev.target, getEncryptions(text));
  }

  /**
   * Load and create the grid
   */
  loadGame(_:any, seed?:string):void {
    this.deleteGrid();
    this.createGrid();
    this.resetProperties();
    this.grid.focus();
    if(seed){
      const clickSeed = this.seed.substr(6);
      const click = new Square(
        parseInt(clickSeed.charAt(0), 36),
        parseInt(clickSeed.charAt(1), 36)
      )

      this.createBombs();
      this.openSquare(click);
    }
    else {
      this.seed = undefined;
    }

    this.updateBombsNumber();
    this.updateJokerNumber();
  }

  deleteGrid(){
    this.grid.innerHTML = "";
  }

  createGrid(){
    for (let x = 0; x < Controller.maxLine; x++) {
      const htmlLine = document.createElement("div");
      htmlLine.className = "line";

      for (let y = 0; y < Controller.maxColumn; y++) {
        const difficulty:string = sessionStorage.difficulty;
        const state: SquareState = "unknown";
        const size: SquareSize = difficulty === "incredible" || difficulty === "hard" ? "small" : "default";
        const border:string = new Square(x, y).getBorders();

        htmlLine.appendChild(new HTMLSquare(state, size, border, x, y).create());
      }

      this.grid.appendChild(htmlLine);
    }
  }

  resetProperties(){
    this.chrono.resetChrono();
    this.flagsPosed = 0;
    Controller.bombs = [];
    this.clickController.click = new Square(undefined, undefined);
    this.grid.style.opacity = "100%";
    this.clickController.click = new Square(undefined, undefined);
    this.grid.style.opacity = "100%";
    document.getElementById("end").style.opacity = "0";
    document.getElementById("end").style.zIndex = "-1";
    this.playing = true;
  }

  /**
   * Check if the game is won
   */
  checkWin():void {
    if (Controller.nbBombs === this.flagsPosed) {
      const unknowns = document.querySelectorAll(".unknown") as any;
      let isAllBombs = true;

      unknowns.forEach((unknown:any) => {
        const square = new Square(unknown.dataset.line, unknown.dataset.column);
        
        if (isAllBombs && !square.isBomb(Controller.bombs)) {
          isAllBombs = false;
        }
      });

      if (isAllBombs) {
        confetti({angle: 45});
        confetti({angle: 135});
        this.finishGame("TE PRAEPOSSUM !");
      }
    }
  }

  /**
   * Place a flag at the position
   * @param click {Square}
   * @return {void}
   */
  placeFlag(click:Square) {
    const htmlSquare = document.getElementById(`${click.line}-${click.column}`);
    if (
      !htmlSquare.className.includes("opened") &&
      !htmlSquare.className.includes("flag")
    ) {
      playSound(document.querySelector('#left'), 0.1)
      this.flagsPosed++;
      htmlSquare.className += " flag";
      htmlSquare.children[1].textContent = "";
    } else if (htmlSquare.className.includes("flag")) {
      playSound(document.querySelector('#right'), 0.1, false);
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

  updateJokerNumber() {
    document.querySelector('.joker').children[0].textContent = `${Controller.nbJoker}🃏`;
  }

  /**
   * Place all bombs around the target
   */
  createBombs(target?:HTMLDivElement):void {
    if(!this.seed){
      this.setSeed(
        getRandomSeed(
          new Square(
            parseInt(target.dataset.line),
            parseInt(target.dataset.column)
          )
        )
      )
    }
    else {
      const click = getClickbySeed(this.seed);
      const parsedSeed = parseInt(this.seed.substr(0, 6), 36);

      for (let i = 0; i < Controller.nbBombs; i++) {
        Controller.bombs.push(getUniqBomb(click, parsedSeed + (i * 2)));
      }
  
      Controller.bombs = Controller.bombs.filter((bomb) => {
        const range = bomb
          .getSquaresInRange(true)
          .filter((b) => !b.isInRange(Controller.bombs));
        return range.length > 0;
      });

      this.chrono.startChrono();
      playRandomMusic();
      this.updateBombsNumber();
    }
  }

  /**
   * Open the square recursively
   * @param at
   * @param bypass
   * @param isFinish
   * @return {Promise<void>}
   */
  async openSquare(at:Square, bypass?:boolean, isFinish?:boolean) {
    const htmlSquare = document.getElementById(
      `${at.line}-${at.column}`
    );
    if (htmlSquare && !at.isBomb(Controller.bombs)) {
      const squareInRange = at.getSquaresInRange(false);
      const closeBombs = squareInRange.filter((b) =>
        b.isInRange(Controller.bombs)
      );

      if (
        !htmlSquare.className.includes("opened") &&
        !htmlSquare.className.includes("flag")
      ) {
        playSound(document.querySelector('#left'), 0.1, false)
        const closeBomb = closeBombs.length > 0 ? closeBombs.length.toString() : "";
        htmlSquare.children[1].textContent = closeBomb;
        htmlSquare.className = htmlSquare.className.replace("unknown", "");
        htmlSquare.className += " opened ";
        htmlSquare.className += `b-${closeBomb}`;
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
    } else if ( htmlSquare && !htmlSquare.className.includes("flag")) {
      htmlSquare.className = htmlSquare.className.replace("unknown", "");
      htmlSquare.className += " bomb";
      htmlSquare.children[1].textContent = "";
      if (!isFinish) {
        this.finishGame("GRATIAS LUDENS !");
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
  finishGame(title:string) {
    document.getElementById("end").textContent = title;
    this.playing = false;
    this.chrono.stopChrono();
    this.grid.style.opacity = "20%";
    document.getElementById("end").style.opacity = "100%";
    document.getElementById("end").style.zIndex = "1";
    this.openAllSquare();
  }
}
