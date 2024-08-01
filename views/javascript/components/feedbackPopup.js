import { fetchServer } from '../utils/fetchServer.js';
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

  async applyFeedback(selectedValues) {
    const feedbackContent = document.getElementById('feedback-content');
    feedbackContent.innerHTML = `
    <div class="spinner-wrap">
      <div class="spinner">
      </div>
    </div>`;
    this.hide();

    const url = 'http://localhost:3000/clova/feedback';
    const response = await fetchServer(
      url,
      'post',
      'json',
      JSON.stringify(selectedValues),
      'feedback error',
    );
    const feedback = await response.json();

    feedbackContent.innerText = feedback;
  }

  handleCancel() {
    this.hide();
  }
}
