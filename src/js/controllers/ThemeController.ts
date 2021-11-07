export default class ThemeController {
  /**
   * Represent the theme controller
   */
  constructor() {
    this.addEventListeners();
    this.loadTheme();
  }

  addEventListeners():void {
    document
      .querySelectorAll(".theme-picker")
      .forEach((picker:any) =>
        picker.addEventListener(
          "click",
          this.changeTheme.bind(this, picker.dataset.value)
        )
      );
  }

  /**
   * Load the theme save
   */
  loadTheme():void {
    const theme:string = sessionStorage.getItem("theme")
      ? sessionStorage.getItem("theme")
      : "default";
    this.changeTheme(theme);
  }

  /**
   * Return true if the theme selection is open
   * @return {boolean}
   */
  isOpen():boolean {
    return document.getElementById("themes").style.height === "45em";
  }

  /**
   * Change the current theme
   */
  changeTheme(theme:string):void {
    const bodys = document.getElementsByTagName("body");
    sessionStorage.setItem("theme", theme);
    
    for (let i = 0; i < bodys.length; i++) {
      bodys[i].id = `theme-${theme}`;
      bodys[i].style.backgroundColor = null;
    }
  }
}
