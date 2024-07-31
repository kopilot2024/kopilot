import { DIRECT_COMMAND_GUID } from '../constants/editorBoxPrompt.js';
import {
  modificationOptions,
  replacementOption,
} from '../constants/modificationOptions.js';

export class EditorBox {
  #holder;
  #textarea;
  #spinner;

  #aiBtn;
  #applyBtn;
  #cancelBtn;

  #input;
  #command;
  #clovaResult;

  static DIRECT_COMMAND = 'DIRECT_COMMAND';

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
      this.#holder.style.display = 'flex';
      return;
    }

    this.#hideTextarea();
    this.#showSpinner();
    this.#requestApi(this.#input, this.#command);
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
    this.#hideSpinner();
    this.#initTextarea();
    this.#showTextarea();

    this.#aiBtn.style.display = 'flex';
    this.#aiBtn.addEventListener('click', () => {
      this.#showSpinner();
      this.#hideTextarea();
      this.#requestApi(this.#input, this.#command);
    });
  }

  #init(applyCallback) {
    this.#textarea = this.#holder.querySelector('textarea');
    this.#spinner = this.#holder.querySelector('.spinner-wrap');

    this.#applyBtn = this.#holder.querySelector('#clova-apply-btn');
    this.#applyBtn.addEventListener('click', () => {
      const replaceText = this.#makeResult();
      applyCallback(replaceText);
    });

    this.#aiBtn = this.#holder.querySelector('#clova-direct-ai-btn');

    this.#cancelBtn = this.#holder.querySelector('#clova-cancel-btn');
    this.#cancelBtn.addEventListener('click', () => this.hide());
  }

  async #requestApi(input, command) {
    this.#aiBtn.style.display = 'none';

    try {
      const res = await fetch(
        'http://localhost:3000/clova/partial-modification',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input,
            command,
            systemMessage:
              command === EditorBox.DIRECT_COMMAND
                ? this.#textarea.value
                : null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error('TODO 에러 핸들링');
      }

      const data = await res.json();

      this.#textarea.value = this.#clovaResult = data.result;
      this.#hideSpinner();
      this.#showTextarea();

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

  #showTextarea() {
    this.#textarea.style.display = 'flex';
  }

  #hideTextarea() {
    this.#textarea.style.display = 'none';
  }

  #showSpinner() {
    this.#spinner.style.display = 'flex';
  }

  #hideSpinner() {
    this.#spinner.style.display = 'none';
  }
}
