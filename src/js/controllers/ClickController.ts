import Square from "../metier/Square";
import Controller from "./Controller";

export default class ClickController {
  controller: Controller;
  click: Square;
  lastLeftClickTime = 0;
  clickTimeoutId: any = null;

  constructor(controller:Controller) {
    this.controller = controller;
    this.click = new Square(undefined, undefined);
    this.registerListeners();
  }

  registerListeners() {
    this.controller.grid.addEventListener(
      "contextmenu",
      this.rightClick.bind(this)
    );
    this.controller.grid.addEventListener("click", this.handleLeftClick.bind(this));
    this.controller.grid.addEventListener("mousedown", this.middleClick.bind(this));
  }

  handleLeftClick(event:any) {
    let currentTime = new Date().getTime();

    if (currentTime - this.lastLeftClickTime <= 200) {
      clearTimeout(this.clickTimeoutId);
      this.middleClick(event, true)
    } else {
      this.clickTimeoutId = setTimeout(() => {
        this.leftClick(event, false)
      }, 200);
    }
    this.lastLeftClickTime = currentTime;
  }

  /**
   * On left click on the grid
   * @param event
   * @param bypass {boolean}
   * @return {void}
   */
  leftClick(event:any, bypass:boolean) {
    if(document.getElementById('main').className === ""){
      const leftFlag:HTMLInputElement = document.querySelector("#leftFlag");

      if (!bypass && leftFlag.checked) {
        this.rightClick(event, true);
        return;
      }
      if (this.controller.playing) {
        const target = event.target.className.includes("square")
          ? event.target
          : event.target.parentElement;

        this.click.line = parseInt(target.dataset.line);
        this.click.column = parseInt(target.dataset.column);

        if (this.click.line >= 0 && this.click.column >= 0 && Controller.bombs.length === 0) this.controller.createBombs(target);

        this.controller
          .openSquare(this.click, false, false)
          .then(() => this.controller.checkWin());
      }
    }
  }

  middleClick(event:any, dblClick:boolean = false) {
    const target = event.target.className.includes("square")
    ? event.target
    : event.target.parentElement;

    event.preventDefault();
    if(
      (
        Controller.bombs.length > 0
        && Controller.nbJoker > 0
        && target.className.includes("unknown")
        && !target.className.includes("flag")
      )
      && (event.button === 1 || dblClick)
    ){
      const square = new Square(parseInt(target.dataset.line), parseInt(target.dataset.column))
      if(square.isBomb(Controller.bombs)){
        this.controller.placeFlag(square);
        this.controller.checkWin();
      }
      else {
        this.controller
        .openSquare(square, false, false)
        .then(() => this.controller.checkWin());
      }
      Controller.nbJoker--;
      this.controller.updateJokerNumber();
    }
  }

  /**
   * On right click on the grid
   * @param event
   * @param bypass
   * @return {void}
   */
  rightClick(event:any, bypass:boolean) {
    if(document.getElementById('main').className === ""){
      event.preventDefault();
      const leftFlag:HTMLInputElement = document.querySelector("#leftFlag");

      if (!bypass && leftFlag.checked) {
        this.leftClick(event, true);
        return;
      }
      if (this.controller.playing) {
        const target = event.target.className.includes("square")
          ? event.target
          : event.target.parentElement;
        let isFirstClick = false;
        this.click.line = parseInt(target.dataset.line);
        this.click.column = parseInt(target.dataset.column);

        if (this.click.line >= 0 && this.click.column >= 0 && Controller.bombs.length === 0) {
          isFirstClick = true;
          this.controller.createBombs(target);
        }

  
        if (!isFirstClick) {
          this.controller.placeFlag(this.click);
          this.controller.checkWin();
        } else {
          this.controller.openSquare(this.click, false, false).then();
        }
      }
    }
  }
}
