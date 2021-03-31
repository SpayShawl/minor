export default class FlagController {
  /**
   * Represent the flag controller
   * @return {FlagController}
   */
  constructor() {
    this.addEventListeners();
    this.loadConfig();
  }

  addEventListeners() {
    document
      .getElementById("leftFlag")
      .addEventListener("change", this.switchFlagOnClick);
  }

  /**
   * Load the config of flag checkbox
   * @return {void}
   */
  loadConfig() {
    const flagOnClick = sessionStorage.getItem("flagOnClick");

    if (flagOnClick === "true") {
      document.getElementById("leftFlag").checked = true;
    }
  }

  /**
   * Switch the value of checkbox
   * @return {void}
   */
  switchFlagOnClick() {
    const flagOnClick = sessionStorage.getItem("flagOnClick");

    if (flagOnClick === "true") {
      sessionStorage.setItem("flagOnClick", "false");
    } else {
      sessionStorage.setItem("flagOnClick", "true");
    }
  }
}
