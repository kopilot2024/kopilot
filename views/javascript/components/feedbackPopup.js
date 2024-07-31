import { Popup } from './popup.js';

export class FeedbackPopup extends Popup {
  #radioButtons;

  constructor(holder, overlay) {
    super(holder, overlay);
    this.#init();
  }

  #init() {
    this.#radioButtons = this.holder.querySelectorAll(
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

    const buttons = this.holder.querySelectorAll('button');
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

  async handleSubmit() {
    const text = document.getElementById('textarea').value;
    const selectedValues = { text: text };
    this.#radioButtons.forEach((btn) => {
      if (btn.checked) {
        const name = btn.name;
        const value = btn.value;
        selectedValues[name] = value;
      }
    });
    if (text.length > 2000) {
      const feedbackContent = document.getElementById('feedback-content');
      feedbackContent.innerHTML = `2000자를 넘어가면 피드백할 수 없습니다.`;
      this.hide();
    } else {
      this.applyFeedback(selectedValues);
    }
  }

  /**
   * node 서버로 피드백 요청
   * @param selectedValues
   */
  async #fetchServer(selectedValues) {
    const URL = 'http://localhost:3000/clova/feedback';
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedValues),
      });
      // 응답 JSON으로 변환
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error during feedback:', error);
      throw error;
    }
  }

  async applyFeedback(selectedValues) {
    const feedbackContent = document.getElementById('feedback-content');
    feedbackContent.innerHTML = `
    <div class="spinner-wrap">
      <div class="spinner">
      </div>
    </div>`;
    this.hide();
    const feedback = await this.#fetchServer(selectedValues);
    feedbackContent.innerText = feedback;
  }

  handleCancel() {
    this.hide();
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
