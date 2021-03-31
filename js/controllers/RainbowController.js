export default class RainbowController {
  /**
   * Represent the rainbow theme
   * @return {RainbowController}
   */
  constructor() {
    this.id = 0;
  }

  /**
   * Start playing and randomize colors
   * @return {void}
   */
  playTheme() {
    this.rollColors();
    this.id = setTimeout(() => this.playTheme(), 1000);
  }

  /**
   * Stop the theme and reset colors
   * @return {void}
   */
  stopTheme() {
    document.getElementsByTagName("body");
    document.getElementById("reset").style.color = null;
    document.getElementById("wringing").style.color = null;
    document.getElementById("chrono").style.color = null;
    document.getElementById("end").style.color = null;
    document.getElementById("nbBomb").style.color = null;
    document.querySelectorAll(".opened").forEach((opened) => {
      opened.style.color = null;
    });
    document.querySelectorAll(".flag").forEach((flag) => {
      flag.style.color = null;
    });
    document.querySelectorAll(".switch").forEach((e) => {
      e.style.color = null;
    });
    document.querySelectorAll(".bomb").forEach((bomb) => {
      bomb.style.color = null;
    });
    document.getElementsByTagName("footer").forEach((footer) => {
      footer.style.color = null;
    });
    document.getElementsByTagName("a").forEach((a) => {
      a.style.color = null;
    });
    clearTimeout(this.id);
  }

  /**
   * Roll all colors randomly
   * @return {void}
   */
  rollColors() {
    const backColor = this.getRandomColor("123");
    const textColor = this.getRandomColor("F96");
    document.getElementById("theme-rainbow").style.backgroundColor = backColor;
    document.getElementById("wringing").style.backgroundColor = backColor;
    document.getElementById("wringing").style.color = textColor;
    document.getElementById("reset").style.color = textColor;
    document.getElementById("chrono").style.color = textColor;
    document.getElementById("end").style.color = textColor;
    document.getElementById("nbBomb").style.color = textColor;
    document.querySelectorAll(".difficulty").forEach((difficulty) => {
      difficulty.style.backgroundColor = backColor;
      difficulty.style.color = textColor;
    });
    document.querySelectorAll(".unknown").forEach((unknown) => {
      unknown.style.backgroundColor = backColor;
    });
    document.querySelectorAll(".opened").forEach((opened) => {
      opened.style.backgroundColor = backColor;
      opened.style.color = textColor;
    });
    document.querySelectorAll(".bomb").forEach((bomb) => {
      bomb.style.backgroundColor = backColor;
      bomb.style.color = textColor;
    });
    document.querySelectorAll(".flag").forEach((flag) => {
      flag.style.color = textColor;
    });
    document.querySelectorAll(".switch").forEach((e) => {
      e.style.color = textColor;
    });
    document.getElementsByTagName("footer").forEach((footer) => {
      footer.style.color = textColor;
    });
    document.getElementsByTagName("a").forEach((a) => {
      a.style.color = textColor;
    });
  }

  /**
   * Return a random color in the letter range
   * @param letters {string}
   * @return {string}
   */
  getRandomColor(letters) {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }
}
