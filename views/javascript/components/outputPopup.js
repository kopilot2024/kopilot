import { Popup } from './popup.js';

export class OutputPopup extends Popup {
  #title;
  #content;
  #applyBtn;
  #cancelBtn;

  constructor(title, content, applyCallback) {
    super(
      document.getElementById('output-popup'),
      document.getElementById('overlay'),
    );
    this.#init();
    this.set(title, content, applyCallback);
  }

  set(title, content, applyCallback) {
    this.#setTitle(title);
    this.#setContent(content);

    this.#setApplyBtnCallback(applyCallback);
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
