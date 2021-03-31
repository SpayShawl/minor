import Controller from "./Controller";

export default class DifficultyController {
  /**
   * Control the difficulty
   * @param controller
   * @return {DifficultyController}
   */
  constructor(controller) {
    this.controller = controller;
    this.loadConfig();
    this.addEventListeners();
  }

  addEventListeners() {
    document
      .querySelectorAll(".difficulty")
      .forEach((picker) =>
        picker.addEventListener(
          "click",
          this.changeDifficulty.bind(this, picker.dataset.value)
        )
      );
  }

  /**
   * Load the difficulty saved
   */
  loadConfig() {
    this.changeDifficulty(sessionStorage.getItem("difficulty"));
  }

  /**
   * Change the game difficulty
   * @param difficulty
   * @return {void}
   */
  changeDifficulty(difficulty) {
    sessionStorage.setItem("difficulty", difficulty);
    const params = this.getDifficulty(difficulty);
    Controller.nbBombs = params.bombs;
    Controller.maxLine = params.line;
    Controller.maxColumn = params.column;
    this.controller.reset();
  }

  /**
   * Return the config in case of difficulty
   * @param difficulty
   * @return {{params: {bombs: number, line: number, column: number}}}
   */
  getDifficulty(difficulty) {
    let params;
    switch (difficulty) {
      case "medium":
        params = {
          bombs: 40,
          line: 15,
          column: 13,
        };
        break;
      case "hard":
        params = {
          bombs: 99,
          line: 30,
          column: 16,
        };
        break;
      case "incredible":
        params = {
          bombs: 200,
          line: 50,
          column: 20,
        };
        break;
      /*easy*/
      default:
        params = {
          bombs: 10,
          line: 10,
          column: 10,
        };
        break;
    }
    return params;
  }
}
