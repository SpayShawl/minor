import RainbowController from "./RainbowController";

export default class ThemeController {
  /**
   * Represent the theme controller
   * @return {ThemeController}
   */
  constructor() {
    this.rainbow = new RainbowController();
    this.addEventListeners();
    this.loadTheme();
  }

  addEventListeners() {
    document
      .getElementById("wringing")
      .addEventListener("click", this.wringing.bind(this));
    document
      .querySelectorAll(".theme-picker")
      .forEach((picker) =>
        picker.addEventListener(
          "click",
          this.changeTheme.bind(this, picker.dataset.value)
        )
      );
  }

  /**
   * Load the theme save
   * @return {void}
   */
  loadTheme() {
    const theme = sessionStorage.getItem("theme")
      ? sessionStorage.getItem("theme")
      : "dark-blue";
    this.changeTheme(theme);
  }

  /**
   * Open or close the theme selection
   * @return {void}
   */
  wringing() {
    !this.isOpen()
      ? (document.getElementById("themes").style.height = "45em")
      : (document.getElementById("themes").style.height = "4em");
  }

  /**
   * Return true if the theme selection is open
   * @return {boolean}
   */
  isOpen() {
    return document.getElementById("themes").style.height === "45em";
  }

  /**
   * Change the current theme
   * @param theme
   * @return {void}
   */
  changeTheme(theme) {
    const bodys = document.getElementsByTagName("body");
    sessionStorage.setItem("theme", theme);
    for (let i = 0; i < bodys.length; i++) {
      bodys[i].id = `theme-${theme}`;
      bodys[i].style.backgroundColor = null;
    }
    theme === "rainbow" ? this.rainbow.playTheme() : this.rainbow.stopTheme();
  }
}
