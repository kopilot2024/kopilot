import { Popup } from './popup.js';
import { RadioBtnGroup } from './radioBtnGroup.js';

export class FeedbackPopup extends Popup {
  #radioBtnGroups;

  constructor(holder, overlay) {
    super(holder, overlay);

    this.#radioBtnGroups = Array.from(
      this.holder.querySelectorAll('.radio-btn-group'),
    ).map((group) => new RadioBtnGroup(group));
    this.#init();
  }

  #init() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    const buttons = this.holder.querySelectorAll('button');
    buttons.forEach((btn) => {
      if (btn.id === 'feedback-submit-btn') {
        btn.addEventListener('click', this.handleSubmit);
      } else {
        btn.addEventListener('click', this.handleCancel);
      }
    });
  }

  async handleSubmit() {
    const text = document.getElementById('textarea').value;
    const selectedValues = { text };

    this.#radioBtnGroups.forEach((group) => {
      const btn = group.getSelectedBtn();
      selectedValues[btn.name] = btn.value;
    });
    this.applyFeedback(selectedValues);
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
}
