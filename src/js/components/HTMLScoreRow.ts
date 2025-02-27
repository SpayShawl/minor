import {Score} from "../model/Score";
import { Timestamp } from "firebase/firestore";
import {formatDate} from "../utils/Utils";
import Controller from "../controllers/Controller";

export default class HTMLScoreRow {
  controller: Controller;
  score: Score

  constructor(
    controller: Controller,
    score:Score
  ) {
    this.controller = controller;
    this.score = score;
  }

  create(): HTMLTableRowElement{
    const row = document.createElement('tr');
    row.className = "scores-row";
    row.appendChild(this.addCell(this.score.name));

    if (this.score.difficulty !== null) {
      row.appendChild(this.addCell(this.buildTime(this.score.time)));
      row.appendChild(this.addCell(this.score.seed));
      row.appendChild(this.addCell(this.buildDate(this.score.createdAt)));
      row.appendChild(this.addPlayBytton());
    } else {
      row.appendChild(this.addCell(""));
      row.appendChild(this.addCell(""));
      row.appendChild(this.addCell(""));
      row.appendChild(this.addCell(""));
    }

    return row;
  }

  addCell(value: string): HTMLTableCellElement {
    const cell = document.createElement('td');
    cell.textContent = value

    return cell;
  }

  addPlayBytton(): HTMLTableCellElement {
    const cell = document.createElement('td');
    cell.id = "scores-row-play-cell";

    const button = document.createElement('button');
    button.className = "scores-row-play-button";
    button.addEventListener('click', () => {
      this.controller.setSeed(this.score.seed);
    });

    cell.appendChild(button);
    return cell;
  }

  buildTime(time: number): string {
    const minutes = Math.floor(time / 60) ?? 0;
    const seconds = (time - minutes * 60).toString().split('.')[0] ?? 0;
    const milliseconds = time.toString().split('.')[1] ?? 0;
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  buildDate(timestamp: Timestamp) {
    return formatDate(timestamp.toDate());
  }
}