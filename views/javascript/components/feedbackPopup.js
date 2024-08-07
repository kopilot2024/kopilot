import { fetchServer } from '../utils/fetchServer.js';
import { BasePopup } from './basePopup.js';
import { RadioBtnGroup } from './radioBtnGroup.js';

export class FeedbackPopup extends BasePopup {
  #radioBtnGroups;
  #feedbackContent;

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
    this.#feedbackContent = document.getElementById('feedback-content');

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
    this.#feedbackContent.innerHTML = `
    <div class="spinner-wrap">
      <div class="spinner">
      </div>
    </div>`;
    this.hide(false);

    const url = `${window.kopilotConfig.API_BASE_URL}/clova/feedback`;
    const response = await fetchServer(
      url,
      'post',
      'json',
      JSON.stringify(selectedValues),
      'feedback error',
    );
    const feedback = await response.json();

    this.#feedbackContent.innerHTML = '';
    feedback.forEach((item) => {
      const section = this.#createSection(item);
      this.#feedbackContent.appendChild(section);
    });
  }

  #createSection(item) {
    const { title, score, description } = item;
    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `
      <h3>${title}: <span class="score">${score}</span></h3>
      <p>${description}</p>
    `;
    return section;
  }

  handleCancel() {
    this.hide(false);
  }
}
