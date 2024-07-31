import { DIRECT_COMMAND_GUID } from '../constants/editorBoxPrompt.js';
import {
  modificationOptions,
  replacementOption,
} from '../constants/modificationOptions.js';
import { RadioBtnGroup } from './radioBtnGroup.js';

export class EditorBox {
  #holder;
  #textarea;
  #radioBtnGroup;
  #spinner;

  #aiBtn;
  #applyBtn;
  #cancelBtn;

  #input;
  #command;
  #clovaResult;

  static DIRECT_COMMAND = 'DIRECT_COMMAND';
  static SYNONYM = 'SYNONYM';

  constructor(applyCallback) {
    this.#holder = document.getElementById('editor-box');
    this.#init(applyCallback);
  }

  show(text, command, label) {
    this.#input = text;
    this.#command = command;

    const h4 = this.#holder.querySelector('h4');
    h4.innerHTML = this.#makeTitle(label);

    this.#hideButton();

    if (this.#command === EditorBox.DIRECT_COMMAND) {
      this.#directCommand();
    } else {
      this.#showSpinner();
      this.#requestApi();
    }
    this.#holder.style.display = 'flex';
  }

  hide() {
    this.#holder.style.display = 'none';
  }

  #hideButton() {
    this.#applyBtn.style.display = 'none';
    this.#aiBtn.style.display = 'none';
  }

  #directCommand() {
    this.#initTextarea();
    this.#hideSpinner();

    this.#aiBtn.style.display = 'flex';
    this.#aiBtn.addEventListener('click', () => {
      this.#showSpinner();
      this.#requestApi();
    });
  }

  #init(applyCallback) {
    this.#textarea = this.#holder.querySelector('textarea');
    this.#spinner = this.#holder.querySelector('.spinner-wrap');
    this.#radioBtnGroup = new RadioBtnGroup(
      this.#holder.querySelector('.radio-btn-group'),
    );

    this.#applyBtn = this.#holder.querySelector('#clova-apply-btn');
    this.#applyBtn.addEventListener('click', () => {
      const replaceText = this.#makeResult();
      applyCallback(replaceText);
    });

    this.#aiBtn = this.#holder.querySelector('#clova-direct-ai-btn');

    this.#cancelBtn = this.#holder.querySelector('#clova-cancel-btn');
    this.#cancelBtn.addEventListener('click', () => this.hide());
  }

  async #requestApi() {
    this.#aiBtn.style.display = 'none';

    try {
      const res = await fetch(
        'http://localhost:3000/clova/partial-modification',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: this.#input,
            command: this.#command,
            systemMessage:
              this.#command === EditorBox.DIRECT_COMMAND
                ? this.#textarea.value
                : null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error('TODO 에러 핸들링');
      }

      const data = await res.json();

      this.#hideSpinner();

      if (this.#command === EditorBox.SYNONYM) {
        this.#textarea.style.display = 'none';
        this.#radioBtnGroup.addButtons(data.result, 'synonym');
      } else {
        this.#textarea.value = this.#clovaResult = data.result;
      }

      this.#applyBtn.style.display = 'flex';
    } catch (error) {
      console.error('Error:', error);
    }
  }

  #makeTitle(label) {
    const text = this.#input;
    return `
    "<span>${text.length < 30 ? text : text.substring(0, 10) + ' ... ' + text.substring(text.length - 6)}</span>"을(를) 
    "<span>${label}</span>"중이에요!`;
  }

  #makeResult() {
    if (this.#command === EditorBox.SYNONYM) {
      this.#clovaResult = this.#radioBtnGroup.getSelectedBtn().value;
    }

    const originalData = this.#input;
    const newData = this.#clovaResult;

    switch (modificationOptions[this.#command]) {
      case replacementOption.BEFORE:
        return `${originalData}\n\n${newData}`;
      case replacementOption.AFTER:
        return `${newData}\n\n${originalData}`;
      default:
        return newData;
    }
  }

  #initTextarea() {
    this.#textarea.value = '';
    this.#textarea.placeholder = DIRECT_COMMAND_GUID;
  }

  #showSpinner() {
    this.#spinner.style.display = 'flex';

    this.#textarea.style.display = 'none';
    this.#radioBtnGroup.hide(true);
  }

  #hideSpinner() {
    this.#spinner.style.display = 'none';

    this.#textarea.style.display = 'flex';
    this.#radioBtnGroup.show();
  }
}
