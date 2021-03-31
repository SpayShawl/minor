import Square from "../metier/Square";

export default class ClickController {
  /**
   * Represent the click controller
   * @param controller {Controller}
   * @return {ClickController}
   */
  constructor(controller) {
    this.controller = controller;
    this.click = new Square(undefined, undefined);
    this.registerListeners();
  }

  registerListeners() {
    this.controller.grid.addEventListener(
      "contextmenu",
      this.rightClick.bind(this)
    );
    this.controller.grid.addEventListener("click", this.leftClick.bind(this));
  }

  /**
   * On left click on the grid
   * @param event
   * @param bypass {boolean}
   * @return {void}
   */
  leftClick(event, bypass) {
    if (!bypass && document.getElementById("leftFlag").checked) {
      this.rightClick(event, true);
      return;
    }
    if (this.controller.playing) {
      const target = event.target.className.includes("square")
        ? event.target
        : event.target.parentElement;
      if (this.click.line === undefined) this.controller.createBombs(target);
      this.click.line = parseInt(target.dataset.line);
      this.click.column = parseInt(target.dataset.column);
      this.controller
        .openSquare(this.click, false, false)
        .then(this.controller.checkWin());
    }
  }

  /**
   * On right click on the grid
   * @param event
   * @param bypass
   * @return {void}
   */
  rightClick(event, bypass) {
    event.preventDefault();
    if (!bypass && document.getElementById("leftFlag").checked) {
      this.leftClick(event, true);
      return;
    }
    if (this.controller.playing) {
      const target = event.target.className.includes("square")
        ? event.target
        : event.target.parentElement;
      let isFirstClick = false;
      if (this.click.line === undefined) {
        isFirstClick = true;
        this.controller.createBombs(target);
      }

      this.click.line = parseInt(target.dataset.line);
      this.click.column = parseInt(target.dataset.column);

      if (!isFirstClick) {
        this.controller.placeFlag(this.click);
        this.controller.checkWin();
      } else {
        this.controller.openSquare(this.click, false, false).then();
      }
    }
  }
}
