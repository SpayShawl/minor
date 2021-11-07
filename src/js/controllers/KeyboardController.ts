import { getRandomColor, playSound } from "../utils/Utils";
import Controller from "./Controller";

export default class KeyboardController {
    controller: Controller;

    constructor(controller:Controller){
        this.controller = controller;
        this.registerListeners();
    }

    registerListeners(){
        document.body.addEventListener('keydown', this.controlKeyboardModal.bind(this));
        document.body.addEventListener('keyup', this.controlKeyboardModal.bind(this));
    
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('mousedown', this.controlKeyboardModal.bind(this));
            key.addEventListener('mouseup', this.controlKeyboardModal.bind(this))
        })
    }

    controlKeyboardModal(event:any){
        if(event.key === 'Shift'){
            this.openKeyboard();
        }
        else if(event.key === 'Escape'){
            this.closeKeyboard();
        }
        else {
            const key = document.getElementById(event.key?.toUpperCase()) || event.target;

            if(event.type === "mousedown" || event.type === "keydown"){
                this.typeOnKeyboard(key);
                this.colorizeKey(key);
            }
            else if(event.type === "mouseup" || event.type === "keyup") {
                this.uncolorizeKey(key);
            }
        }
    }

    openKeyboard(){
        document.getElementById('seedModal').className = "";
        document.getElementById('main').className = "modalOpened";
    }

    closeKeyboard(){
        document.getElementById('seedModal').className = "hiddenKeyboard";
        document.getElementById('main').className = "";
    }

    colorizeKey(key: any){
        if(key.className === "key") {
            key.style.color = getRandomColor();
            key.style.backgroundColor = "#26282C";
        }
    }

    uncolorizeKey(key: any){
        key.style.color = "";
        key.style.backgroundColor = "#36393F";
    }

    typeOnKeyboard(key:any){
        if(key.className === "key") {
            const value = document.getElementById('value');
            const letter = key.id;

            playSound(document.querySelector('#typing'));

            letter.length === 1 && this.addLetter(value, letter);
            letter === "BACKSPACE" && !value.textContent.includes("#") && this.removeLetter(value);
            letter === "ENTER" && value.textContent.length === 8 && this.sendValue(value);
            value.textContent.length === 0 && this.showPlaceholder(value);
        }
    }

    addLetter(value:any, letter:any){
        if(value.textContent.includes("#")){
            value.textContent = "";
            value.className = "";
        }
        value.textContent += value.textContent.length < 8 ? letter : '';
    }

    removeLetter(value:any){
        value.textContent = value.textContent.slice(0, -1);
    }

    sendValue(value: any){
        this.closeKeyboard();
        this.controller.setSeed(value.textContent);
    }

    showPlaceholder(value: any){
        value.textContent = "#SEED";
        value.className = "placeholder";
    }
}