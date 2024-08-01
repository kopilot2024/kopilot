import { spellCheck } from '../spell/spellCheck.js';
import { EditorBox } from './editorBox.js';
import { Tooltip } from './tooltip.js';

export class WritingTool extends Tooltip {
  #selectedText;
  #editorBox;
  #synonymBtn;

  constructor(holder, anchor) {
    super(holder, anchor);
    this.#editorBox = new EditorBox((result) => this.#apply(result));
    this.#synonymBtn = this.holder.querySelector(
      'button[data-value="SYNONYM"]',
    );
    this.#init();
  }

  show(selectedText, cancelCallback) {
    this.#selectedText = selectedText;
    this.#addCancelCallback(cancelCallback);
    this.updatePosition();

    this.#synonymBtn.style.display = this.#checkSpace(selectedText)
      ? 'none'
      : 'flex';
    this.holder.style.visibility = 'visible';
  }

  hide() {
    this.holder.style.visibility = 'hidden';
    this.#editorBox.hide();
    this.anchor.removeAttribute('readonly');
  }

  #apply(result) {
    const start = this.anchor.selectionStart;
    const end = this.anchor.selectionEnd;

    const before = this.anchor.value.substring(0, start);
    const after = this.anchor.value.substring(end);

    this.anchor.value = before + result + after;
    spellCheck();
    this.hide();
  }

  #addCancelCallback(callback) {
    this.holder
      .querySelector('#tool-cancel-btn')
      .addEventListener('click', () => {
        this.hide();
        callback();
      });
  }

  #checkSpace(text) {
    return /\s/.test(text);
  }

  #init() {
    Array.from(this.holder.querySelectorAll('.clova-cmd')).forEach((btn) =>
      btn.addEventListener('click', () =>
        this.#editorBox.show(
          this.#selectedText,
          btn.getAttribute('data-value'),
          btn.innerHTML,
        ),
      ),
    );
  }
}
