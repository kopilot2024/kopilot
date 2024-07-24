import { EditorBox } from './editorBox.js';
import { Tooltip } from './tooltip.js';

export class WritingTool extends Tooltip {
  #selectedText;
  #editorBox;

  constructor(holder, anchor) {
    super(holder, anchor);
    this.#editorBox = new EditorBox((result) => this.#apply(result));
    this.#init();
  }

  show(selectedText, cancelCallback) {
    this.#selectedText = selectedText;
    this.#addCancelCallback(cancelCallback);
    this.updatePosition();

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
