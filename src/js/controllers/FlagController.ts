export default class FlagController {
  /**
   * Represent the flag controller
   * @return {FlagController}
   */
  constructor() {
    this.addEventListeners();
    this.loadConfig();
  }

  addEventListeners():void {
    document
      .getElementById("leftFlag")
      .addEventListener("change", this.switchFlagOnClick);
  }

  /**
   * Load the config of flag checkbox
   */
  loadConfig():void {
    const flagOnClick:string = sessionStorage.getItem("flagOnClick");
    const combobox:HTMLInputElement = document.getElementById("leftFlag") as HTMLInputElement;

    if (flagOnClick === "true") {
      combobox.checked = true;
    }
  }

  /**
   * Switch the value of checkbox
   */
  switchFlagOnClick():void {
    const flagOnClick:string = sessionStorage.getItem("flagOnClick");

    if (flagOnClick === "true") {
      sessionStorage.setItem("flagOnClick", "false");
    } else {
      sessionStorage.setItem("flagOnClick", "true");
    }
  }
}
