export class FeedbackPopup {
  #holder;
  #overlay;
  #radioButtons;

  constructor(holder, overlay) {
    this.#holder = holder;
    this.#overlay = overlay;
    this.#init();
  }

  show() {
    this.#holder.style.display = 'block';
    this.#overlay.style.display = 'block';
  }

  #hide() {
    this.#holder.style.display = 'none';
    this.#overlay.style.display = 'none';
  }

  #init() {
    this.#radioButtons = this.#holder.querySelectorAll(
      '.radio-btn-group input[type="radio"]',
    );

    this.#radioButtons.forEach((btn) => {
      if (btn.checked) {
        this.#selectRadioBtn(btn);
      }
    });

    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.#radioButtons.forEach((btn) =>
      btn.addEventListener('change', () => this.handleChangeEvent(btn)),
    );

    const buttons = this.#holder.querySelectorAll('button');
    buttons.forEach((btn) => {
      if (btn.id === 'feedback-submit-btn') {
        btn.addEventListener('click', this.handleSubmit);
      } else {
        btn.addEventListener('click', this.handleCancel);
      }
    });
  }

  handleChangeEvent(btn) {
    const radioBtnGroup = this.#findRadioBtnGroup(btn);
    const labels = radioBtnGroup.querySelectorAll('label');
    labels.forEach((label) => this.#cancelRadioBtn(label));

    if (btn.checked) {
      this.#selectRadioBtn(btn);
    }
  }

  handleSubmit() {
    const selectedValues = {};
    this.#radioButtons.forEach((btn) => {
      if (btn.checked) {
        const name = btn.name;
        const value = btn.value;
        selectedValues[name] = value;
      }
    });
    // TODO 추후 CLOVA 요청으로 변경
    alert(JSON.stringify(selectedValues));
  }

  handleCancel() {
    this.#hide();
  }

  #findRadioBtnGroup(btn) {
    return btn.parentElement.parentElement;
  }

  #selectRadioBtn(btn) {
    btn.parentElement.classList.add('active');
  }

  #cancelRadioBtn(label) {
    label.classList.remove('active');
  }
}
