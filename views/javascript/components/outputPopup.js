import { Popup } from './popup.js';

export class OutputPopup extends Popup {
  #title;
  #content;
  #applyBtn;
  #cancelBtn;

  constructor(title, content, applyCallback, cancelCallback) {
    super(
      document.getElementById('output-popup'),
      document.getElementById('overlay'),
    );
    this.#init();
    this.#set(title, content, applyCallback, cancelCallback);
  }

  #set(title, content, applyCallback, cancelCallback) {
    this.#setTitle(title);
    this.#setContent(content);

    this.#setApplyBtnCallback(applyCallback);
    // this.#setCancelBtnCallback(cancelCallback);
  }

  #setTitle(title) {
    this.#title.innerText = title;
  }

  #setContent(content) {
    this.#content.innerHTML = content;
  }

  #setApplyBtnCallback(callback) {
    this.#applyBtn.onclick = callback;
  }

  #init() {
    this.#title = this.holder.querySelector('#output-popup-title');
    this.#content = this.holder.querySelector('#output-popup-content');
    this.#applyBtn = this.holder.querySelector('#output-apply-btn');
    this.#cancelBtn = this.holder.querySelector('#output-cancel-btn');
    this.#cancelBtn.onclick = () => this.hide();
  }
}