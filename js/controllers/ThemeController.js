export default class ThemeController {
  /**
   * Represent the theme controller
   * @return {ThemeController}
   */
  constructor() {
    this.addEventListeners();
    this.loadTheme();
  }

  addEventListeners() {
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
      : "default";
    this.changeTheme(theme);
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
  }
}
