import { HtmlElement } from './htmlElement.js';

export class RadioBtnGroup extends HtmlElement {
  #radioButtons;

  constructor(holder) {
    super(holder);
    this.#init();
  }

  addButtons(result, name) {
    this.holder.innerHTML = result.reduce((acc, curr) => {
      return (
        acc +
        `
        <label>
          <input type="radio" name="${name}" value="${curr}">
          ${curr}
        </label>`
      );
    }, '');
    this.#init();
  }

  getSelectedBtn() {
    return Array.from(this.#radioButtons).filter((btn) => btn.checked)[0];
  }

  hide(deleteOption = false) {
    if (deleteOption) {
      this.holder.innerHTML = '';
    }
    super.hide();
  }

  handleChangeEvent(btn) {
    const labels = this.holder.querySelectorAll('label');

    labels.forEach((label) => this.#cancelBtn(label));

    if (btn.checked) {
      this.#selectBtn(btn);
    }
  }

  #selectBtn(btn) {
    btn.parentElement.classList.add('active');
  }

  #cancelBtn(label) {
    label.classList.remove('active');
  }

  #init() {
    this.#radioButtons = this.holder.querySelectorAll('input[type="radio"]');

    if (this.#radioButtons.length > 0) {
      const firstBtn = this.#radioButtons[0];
      firstBtn.checked = true;
      this.#selectBtn(firstBtn);
    }

    this.handleChangeEvent = this.handleChangeEvent.bind(this);

    this.#radioButtons.forEach((btn) =>
      btn.addEventListener('change', () => this.handleChangeEvent(btn)),
    );
  }
}
