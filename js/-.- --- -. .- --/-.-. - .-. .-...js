/**
 * .-. . .--. .-. ..-.. ... . -. - . / .-.. . / -.-. --- -..
 * . / -.- --- -. .- -- ..
 */
export default class Ctrl {
  constructor() {
    this.addEventListeners();
    this.keys = [];
    this.active = true;
  }

  /**
   *. -.-. --- ..- - . / .-.. . ... / - --- ..- -.-. .... .
   * ... / .--. .-. . ... ... ..-.. ...
   */
  addEventListeners() {
    document.addEventListener("keydown", this.keypress.bind(this));
  }

  /**
   * .- .--- --- ..- - / -.. . ... / - ---
   * ..- -.-. .... . ...
   * @param event
   */
  keypress(event) {
    if (this.active) {
      this.keys.push(event.keyCode);
      this.konami();
    }
  }

  /**
   * ...- ..-.. .-. .. ..-. .. . / ... .. / .-.. . /
   * -.-. --- -.. . / . ... - / -... --- -.
   */
  konami() {
    const code = [38, 38, 40, 40, 37, 39, 37, 39, 65, 66];
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] === code[i]) {
        if (i === 9) {
          this.keys = [];
          this.active = false;
          this.applyCode();
        }
      } else {
        this.keys = [];
      }
    }
  }

  /**
   * .- ..-. ..-. .. -.-. .... . / .-.. .- /
   * ...- .. -.. ..-.. ---
   */
  applyCode() {
    const v = document.createElement("video");
    const s = document.createElement("source");
    s.type = "video/mp4";
    s.src = "./src/piscantur.mp4";
    v.autoplay = true;
    v.id = "v";
    v.appendChild(s);
    v.addEventListener("ended", this.closeCode.bind(this, v));
    document.getElementById("main").style.opacity = "10%";
    document.getElementById("header").style.opacity = "10%";
    document.body.appendChild(v);
  }

  /**
   * . -. .-.. .-..- ...- . / .-.. .- / ...- .. -.. ..-.. ---
   * @param v {HTMLVideoElement}
   */
  closeCode(v) {
    document.getElementById("main").style.opacity = "100%";
    document.getElementById("header").style.opacity = "100%";
    document.body.removeChild(v);
    this.active = true;
  }
}
