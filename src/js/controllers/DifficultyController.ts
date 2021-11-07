import Controller from "./Controller";

export default class DifficultyController {
  controller: Controller;

  constructor(controller:Controller) {
    this.controller = controller;
    this.loadConfig();
    this.addEventListeners();
  }

  addEventListeners() {
    document
      .querySelectorAll(".difficulty")
      .forEach((picker: any) =>
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
    this.changeDifficulty(sessionStorage.getItem("difficulty"), {pointerType: "mouse"});
  }

  /**
   * Change the game difficulty
   * @param difficulty
   * @return {void}
   */
  changeDifficulty(difficulty:string, e:any) {
    if(e.pointerType){
      const params = this.getDifficulty(difficulty);

      sessionStorage.setItem("difficulty", difficulty);
      Controller.nbBombs = params.bombs;
      Controller.nbJoker = params.joker;
      Controller.maxLine = params.line;
      Controller.maxColumn = params.column;
      
      this.controller.loadGame(undefined, undefined);
    }
  }

  /**
   * Return the config in case of difficulty
   * @param difficulty
   * @return {{params: {bombs: number, line: number, column: number}}}
   */
  getDifficulty(difficulty:string) {
    let params;
    switch (difficulty) {
      case "medium":
        params = {
          bombs: 40,
          line: 10,
          column: 18,
          joker: 2,
        };
        break;
      case "hard":
        params = {
          bombs: 99,
          line: 15,
          column: 30,
          joker: 4,
        };
        break;
      case "incredible":
        params = {
          bombs: 200,
          line: 36,
          column: 36,
          joker: 5
        };
        break;
      /*easy*/
      default:
        params = {
          bombs: 10,
          line: 10,
          column: 10,
          joker: 1
        };
        break;
    }
    return params;
  }
}
