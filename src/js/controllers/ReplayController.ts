import Controller from "./Controller";

export default class ReplayController {
  controller: Controller;

  constructor(controller:Controller) {
    this.controller = controller;
    this.addEventListeners();
  }

  addEventListeners() {
    document
    .getElementById("replay")
    .addEventListener("click", this.replay.bind(this));
  }

  replay() {
    this.controller.loadGame(undefined, undefined);
  }
}
