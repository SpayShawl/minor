export default class ChronoController {
  start: any;
  end: any;
  diff: any;
  id: any;
  chronoDiv: HTMLElement;

  constructor() {
    this.start = 0;
    this.end = 0;
    this.diff = 0;
    this.id = 0;
    this.chronoDiv = document.querySelector(".chrono");
  }

  /**
   * Start the chrono
   * @return {void}
   */
  startChrono() {
    this.start = new Date();
    this.chrono();
  }

  /**
   * Register the chrono
   * @return {void}
   */
  chrono() {
    this.end = new Date();
    this.diff = this.end.getTime() - this.start;
    this.diff = new Date(this.diff);
    let sec = this.diff.getSeconds();
    let min = this.diff.getMinutes();
    let milliseconds = this.diff.getMilliseconds();

    this.chronoDiv.textContent = `${min}:${sec}:${milliseconds}`;
    this.id = setTimeout(() => this.chrono(), 1);
  }

  /**
   * Stop the chrono
   * @return {void}
   */
  stopChrono() {
    clearTimeout(this.id);
  }

  /**
   * Reset the chrono
   * @return {void}
   */
  resetChrono() {
    this.stopChrono();
    this.chronoDiv.textContent = "0:0:000";
  }

  getTime() {
    return (this.diff.getMinutes() * 60)
      + this.diff.getSeconds()
      + this.diff.getMilliseconds()
      / 1000;
  }
}
