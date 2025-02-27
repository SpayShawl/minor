import Controller from "./Controller";
import {Firebase} from "../firebase/Firebase";
import HTMLScoreRow from "../components/HTMLScoreRow";

export default class ScoreController {
  controller: Controller;
  nickname: string;
  isVisible: boolean = false;

  table: HTMLElement;
  tableBody: HTMLElement;
  showButton: HTMLElement;
  end: HTMLElement;
  endTitle: HTMLElement;
  scoresFooter: HTMLElement;
  scoresNickname: HTMLInputElement;
  scoresTime: HTMLElement;
  scoresSeed: HTMLElement;
  scoresDate: HTMLElement;

  constructor(controller:Controller) {
    this.controller = controller;
    this.addEventListeners();
    this.registerElements();
    this.loadConfig();
  }

  addEventListeners() {
    document
      .getElementById("scores-button")
      .addEventListener("click", this.showScores.bind(this));
    document
      .getElementById("scores-save-button")
      .addEventListener("click", () => this.checkSaveScore("ENTER"));
  }

  registerElements() {
    this.table = document.getElementById('scores-table');
    this.tableBody = document.getElementById('scores-table-body');
    this.showButton = document.getElementById('scores-button');
    this.end = document.getElementById('end');
    this.endTitle = document.getElementById('end-title');
    this.scoresFooter = document.getElementById('scores-footer');
    this.scoresNickname = document.getElementById('scores-nickname') as HTMLInputElement;
    this.scoresTime = document.getElementById('scores-time');
    this.scoresSeed = document.getElementById('scores-seed');
    this.scoresDate = document.getElementById('scores-date');
  }

  loadConfig():void {
    this.nickname = sessionStorage.getItem("nickname") ?? '';
  }

  showScores() {
    this.isVisible = true;

    if (this.controller.isWin) {
      this.scoresFooter.style.display = "table-footer-group";
      this.scoresNickname.textContent = this.nickname;
      this.scoresTime.textContent = this.controller.chrono.chronoDiv.textContent;
      this.scoresSeed.textContent = this.controller.seed;
    } else {
      this.scoresFooter.style.display = "none";
    }

    this.tableBody.replaceChildren();
    Firebase.getInstance().getScores(this.controller.difficultyController.difficulty)
    .then((scores) => {
      scores.forEach(s => {
        this.tableBody.appendChild(new HTMLScoreRow(this.controller, s).create());
      });
    })
    .finally(() => {
      this.end.style.top = "-25%";
      this.showButton.style.display = "none";
      this.endTitle.style.display = "none";
      this.table.style.display = "block";
      this.scoresNickname.focus();
    });
  }

  saveScore(nickname: string) {
    sessionStorage.setItem("nickname", nickname);

    Firebase.getInstance()
      .addScore(
        nickname,
        this.controller.chrono.getTime(),
        this.controller.seed,
        this.controller.difficultyController.difficulty
      )
      .then(() => {
        this.controller.loadGame(undefined, undefined);
      })
  }

  checkSaveScore(letter: string) {
    const nickname = this.scoresNickname.value;

    if (letter === "ENTER" && nickname.length > 3 && nickname.length < 25) {
      this.saveScore(nickname);
    }
  }
}
