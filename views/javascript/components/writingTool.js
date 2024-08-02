import { STYLE } from '../constants/style.js';
import { spellCheck } from '../spell/spellCheck.js';
import { CharChecker } from '../utils/charChecker.js';
import { DomManager } from '../utils/domManager.js';
import { EditorBox } from './editorBox.js';
import { Tooltip } from './tooltip.js';

export class WritingTool extends Tooltip {
  #selection;

  #editorBox;
  #synonymBtn;
  #highlightContainer;

  constructor(holder, anchor, highlightContainer) {
    super(holder, anchor);
    this.#editorBox = new EditorBox((result) => this.#apply(result));
    this.#synonymBtn = this.holder.querySelector(
      'button[data-value="SYNONYM"]',
    );
    this.#highlightContainer = highlightContainer;
    this.#init();
  }

  show(text, start, end) {
    this.#selection = { text, start, end };

    this.updatePosition();

    if (CharChecker.hasSpace(text)) {
      DomManager.hideElement(this.#synonymBtn);
    } else {
      DomManager.showElement(this.#synonymBtn);
    }

    this.#highlightSelection();
    this.changeVisibility(STYLE.VISIBILITY.VISIBLE);
  }

  hide() {
    this.#removeHighlight();
    this.changeVisibility(STYLE.VISIBILITY.HIDDEN);
    this.#editorBox.hide();
  }

  #apply(result) {
    const before = this.anchor.value.substring(0, this.#selection.start);
    const after = this.anchor.value.substring(this.#selection.end);

    this.anchor.value = before + result + after;
    spellCheck.performSpellCheck();

    this.hide();
  }

  #highlightSelection() {
    const originalText = this.anchor.value;

    const before = originalText.substring(0, this.#selection.start);
    const selected = `<span class='highlight blue'>${this.#selection.text}</span>`;
    const after = originalText.substring(this.#selection.end);

    const text = before + selected + after;
    const htmlText = text.replace(/\n/g, '<br>');

    this.#highlightContainer.innerHTML = htmlText;
    DomManager.syncElements(this.anchor, this.#highlightContainer);
    DomManager.changeVisibility(this.anchor, STYLE.VISIBILITY.HIDDEN);
  }

  #removeHighlight() {
    this.#highlightContainer.innerHTML = '';
    DomManager.changeVisibility(this.anchor, STYLE.VISIBILITY.VISIBLE);
  }

  #init() {
    Array.from(this.holder.querySelectorAll('.clova-cmd')).forEach((btn) =>
      btn.addEventListener('click', () =>
        this.#editorBox.show(
          this.#selection.text,
          btn.getAttribute('data-value'),
          btn.innerHTML,
        ),
      ),
    );
    this.holder
      .querySelector('#tool-cancel-btn')
      .addEventListener('click', () => this.hide());
  }
}
