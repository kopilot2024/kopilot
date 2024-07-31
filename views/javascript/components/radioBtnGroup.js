export class RadioBtnGroup {
  #holder;
  #radioButtons;

  constructor(holder) {
    this.#holder = holder;
    this.#init();
  }

  addButtons(result, name) {
    this.#holder.innerHTML = result.reduce((acc, curr) => {
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
      this.#holder.innerHTML = '';
    }
    this.#holder.style.display = 'none';
  }

  show() {
    this.#holder.style.display = 'flex';
  }

  handleChangeEvent(btn) {
    const labels = this.#holder.querySelectorAll('label');

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
    this.#radioButtons = this.#holder.querySelectorAll('input[type="radio"]');

    const firstBtn = this.#radioButtons[0];
    if (firstBtn) {
      this.#selectBtn(firstBtn);
      firstBtn.checked = true;
    }

    this.handleChangeEvent = this.handleChangeEvent.bind(this);

    this.#radioButtons.forEach((btn) =>
      btn.addEventListener('change', () => this.handleChangeEvent(btn)),
    );
  }
}
