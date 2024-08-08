import { DIRECT_COMMAND_GUIDE } from '../constants/editorBoxPrompt.js';
import { DomManager } from '../utils/domManager.js';
import { fetchServer } from '../utils/fetchServer.js';
import { AlertPopup } from './alertPopup.js';
import { BaseComponent } from './baseComponent.js';
import { RadioBtnGroup } from './radioBtnGroup.js';

const DIRECT_COMMAND = 'DIRECT_COMMAND';
const SYNONYM = 'SYNONYM';
const SPACE = '&nbsp;';

export class EditorBox extends BaseComponent {
  #textarea;
  #radioBtnGroup;
  #spinner;

  #aiBtn;
  #applyBtn;
  #cancelBtn;

  #alertPopup;

  #input;
  #command;
  #position;
  #clovaResult;

  constructor(applyCallback) {
    super(document.getElementById('editor-box'));
    this.#init(applyCallback);
  }

  show(text, command, length, position, label) {
    if (text.length < length && command !== DIRECT_COMMAND) {
      this.#alertPopup.pop(
        `
        "<span class='em'>${label}</span>"은(는)${SPACE}
        <span class='em'>${length}자 이상</span>${SPACE}작성해주세요!`,
        '2rem',
      );
      return;
    }

    this.#input = text;
    this.#command = command;
    this.#position = position;

    const h4 = this.holder.querySelector('h4');
    h4.innerHTML = this.#makeTitle(label);

    this.#hideButton();

    if (this.#command === DIRECT_COMMAND) {
      this.#directCommand();
    } else {
      this.#showSpinner();
      this.#requestApi();
    }
    super.show();
  }

  #hideButton() {
    DomManager.hideElement(this.#applyBtn);
    DomManager.hideElement(this.#aiBtn);
  }

  #directCommand() {
    this.#initTextarea();
    this.#hideSpinner();

    DomManager.showElement(this.#aiBtn);
    this.#aiBtn.addEventListener('click', () => {
      this.#showSpinner();
      this.#requestApi();
    });
  }

  #init(applyCallback) {
    this.#textarea = this.holder.querySelector('textarea');
    this.#spinner = this.holder.querySelector('.spinner-wrap');
    this.#radioBtnGroup = new RadioBtnGroup(
      this.holder.querySelector('.radio-btn-group'),
    );

    this.#applyBtn = this.holder.querySelector('.apply-btn');
    this.#applyBtn.addEventListener('click', () => {
      const replaceText = this.#makeResult();
      applyCallback(replaceText);
    });

    this.#aiBtn = this.holder.querySelector('.direct-ai-btn');

    this.#cancelBtn = this.holder.querySelector('.cancel-btn');
    this.#cancelBtn.addEventListener('click', () => this.hide());

    this.#alertPopup = new AlertPopup(
      this.holder.parentElement.querySelector('.popup.alert'),
    );
  }

  async #requestApi() {
    DomManager.hideElement(this.#aiBtn);

    const url = `${window.kopilotConfig.API_BASE_URL}/clova/partial-modification`;
    const body = JSON.stringify({
      input: this.#input,
      command: this.#command,
      systemMessage:
        this.#command === DIRECT_COMMAND ? this.#textarea.value : null,
    });

    const response = await fetchServer(
      url,
      'post',
      'json',
      body,
      'partial modification error',
    );
    const { result } = await response.json();

    this.#hideSpinner();

    if (this.#command === SYNONYM) {
      DomManager.hideElement(this.#textarea);
      if (result.length === 0) {
        this.#alertPopup.pop('유의어가 발견되지 않았습니다.');
        this.hide();
        return;
      }

      this.#radioBtnGroup.addButtons(result, 'synonym');
      this.#radioBtnGroup.show();
    } else {
      this.#textarea.value = this.#clovaResult = result;
    }

    DomManager.showElement(this.#applyBtn);
  }

  #makeTitle(label) {
    const text = this.#input;
    return `
    "<span class='em'>${text.length < 30 ? text : text.substring(0, 10) + ' ... ' + text.substring(text.length - 6)}</span>"을(를) 
    "<span class='em'>${label}</span>"중이에요!`;
  }

  #makeResult() {
    if (this.#command === SYNONYM) {
      this.#clovaResult = this.#radioBtnGroup.getSelectedBtn().value;
    }

    const originalData = this.#input;
    const newData = this.#clovaResult;

    switch (this.#position) {
      case 'BEFORE':
        return `${newData}\n\n${originalData}`;
      case 'AFTER':
        return `${originalData}\n\n${newData}`;
      default:
        return newData;
    }
  }

  #initTextarea() {
    this.#textarea.value = '';
    this.#textarea.placeholder = DIRECT_COMMAND_GUIDE;
  }

  #showSpinner() {
    DomManager.showElement(this.#spinner);

    DomManager.hideElement(this.#textarea);
    this.#radioBtnGroup.hide();
  }

  #hideSpinner() {
    DomManager.hideElement(this.#spinner);

    DomManager.showElement(this.#textarea);
    this.#radioBtnGroup.hide();
  }
}
