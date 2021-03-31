export default class ChronoController {
  /**
   * Represent the chrono
   * @return {void}
   */
  constructor() {
    this.start = 0;
    this.end = 0;
    this.diff = 0;
    this.id = 0;
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
    this.diff = this.end - this.start;
    this.diff = new Date(this.diff);
    let sec = this.diff.getSeconds();
    let min = this.diff.getMinutes();

    document.getElementById("chrono").textContent = `${
      min > 0 ? min + "M" : ""
    } ${sec}S`;
    this.id = setTimeout(() => this.chrono(), 1000);
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
    document.getElementById("chrono").textContent = "0S";
  }
}
