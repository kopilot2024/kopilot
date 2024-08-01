import { CharCounter } from '../CharCounter/CharCounter.js';
import { KEY } from '../constants/eventKey.js';
import { LongSentence } from '../longSentence/longSentence.js';
import { spellCheck } from '../spell/spellCheck.js';
import { CharChecker } from '../utils/charChecker.js';
import { KeyChecker } from '../utils/keyChecker.js';
import { HtmlElement } from './htmlElement.js';

export class Textarea extends HtmlElement {
  #autoCompleteSettings;
  #writingTool;
  #nextCursorPointer;
  #longSentence;

  constructor(holder, autoCompleteSettings, writingTool) {
    super(holder);
    this.#autoCompleteSettings = autoCompleteSettings;
    this.#writingTool = writingTool;
    this.#longSentence = LongSentence.getInstance();
    this.#init();
  }

  changeEndingType(key) {
    this.#autoCompleteSettings.setEndingType(key);
  }

  static isAutoCompletePosition(currPointer, autoPointer) {
    return currPointer === autoPointer || currPointer === autoPointer + 1;
  }

  handleInputEvent(event) {
    spellCheck.spellCheckOnContinuousInput();

    const output = document.getElementById('output');
    output.innerHTML = this.#holder.value;

    if (!event.isComposing && CharChecker.isIMECharacter(event.data)) {
      this.#removeLastCharacter();
      this.#restoreNextCursorPointer();
      event.preventDefault();
    }

    CharCounter.updateTextareaCounter(this.#holder.value);
    this.#longSentence.checkLength();
    spellCheck.setSpellHightlight();
    this.#longSentence.setLongSentenceEvent();
  }

  handleKeydownEvent(event) {
    const code = event.code;
    const key = event.key;

    const cursorPointer = this.#getCursorPointer();
    const autoPointer = this.#autoCompleteSettings.getPointer();

    if (KeyChecker.isSentenceTerminated(key)) {
      spellCheck.spellCheckOnPunctuation();
    }

    if (!Textarea.isAutoCompletePosition(cursorPointer, autoPointer)) {
      this.#autoCompleteSettings.emptyCursorBox();
    }

    if (code === KEY.BACKSPACE) {
      this.handleBackspace();
      return;
    }
    if (
      (code === KEY.SPACE && key !== 'Process') ||
      code === KEY.ENTER ||
      KeyChecker.isArrowKeyEvent(code)
    ) {
      this.#autoCompleteSettings.emptyAll();
      return;
    }

    if (code === KEY.TAB) {
      event.preventDefault();

      // TODO OS 충돌로 인해 비활성화
      // if (key !== 'Process') {
      //   return;
      // }

      const ending = this.#autoCompleteSettings.getEnding();
      if (!ending) {
        return;
      }

      if (cursorPointer === autoPointer + 1) {
        this.#removeIncompleteCharacter(autoPointer);
      }
      this.#insertPhrase(autoPointer, ending);
      this.#autoCompleteSettings.emptyAll();
      this.#setNextCursorPointer(autoPointer, ending);
      return;
    }
  }

  handleCompositionstartEvent() {
    this.#autoCompleteSettings.emptyChar();
  }

  handleCompositionupdateEvent(event) {
    this.#autoCompleteSettings.updateChar(event.data);
  }

  handleCompositionendEvent(event) {
    this.#autoCompleteSettings.updateWord(event.data);

    if (this.#autoCompleteSettings.hasEnding()) {
      this.#autoCompleteSettings.showCursorBox(this.#getCursorPointer());
    }
  }

  handleMouseupEvent() {
    const start = this.holder.selectionStart;
    const end = this.holder.selectionEnd;
    if (start === end) {
      this.#writingTool.hide();
      return;
    }
    const selectedText = this.holder.value.substring(start, end);

    // TODO 사용자 편의성 때문에 일단 주석 처리
    // this.#lock();

    this.#writingTool.show(selectedText, () => this.#unlock());
  }

  handleBackspace() {
    if (this.#autoCompleteSettings.hasChar()) {
      this.#autoCompleteSettings.backspaceChar();
      return;
    }
    this.#autoCompleteSettings.backspaceWord();
  }

  #init() {
    this.#bindEvent();
    this.#addEventListener();
  }

  #getCursorPointer() {
    return this.holder.selectionStart;
  }

  #insertPhrase(pointer, phrase) {
    const before = this.holder.value.substring(0, pointer);
    const after = this.holder.value.substring(pointer);

    this.holder.value = before + phrase + after;
  }

  #removeIncompleteCharacter(autoPointer) {
    const before = this.holder.value.substring(0, autoPointer);
    const after = this.holder.value.substring(autoPointer + 1);

    this.holder.value = before + after;
  }

  #removeLastCharacter() {
    const currLen = this.holder.value.length;
    this.holder.value = this.holder.value.substring(0, currLen - 1);
  }

  #setNextCursorPointer(currPointer, phrase) {
    this.#nextCursorPointer = currPointer + phrase.length;
  }

  #restoreNextCursorPointer() {
    this.holder.selectionStart = this.#nextCursorPointer;
    this.holder.selectionEnd = this.#nextCursorPointer;
  }

  #lock() {
    this.holder.setAttribute('readonly', true);
  }

  #unlock() {
    this.holder.removeAttribute('readonly');
  }

  #bindEvent() {
    this.handleKeydownEvent = this.handleKeydownEvent.bind(this);
    this.handleCompositionstartEvent =
      this.handleCompositionstartEvent.bind(this);
    this.handleCompositionupdateEvent =
      this.handleCompositionupdateEvent.bind(this);
    this.handleCompositionendEvent = this.handleCompositionendEvent.bind(this);
    this.handleInputEvent = this.handleInputEvent.bind(this);
    this.handleMouseupEvent = this.handleMouseupEvent.bind(this);
  }

  #addEventListener() {
    this.holder.addEventListener('keydown', this.handleKeydownEvent);
    this.holder.addEventListener(
      'compositionstart',
      this.handleCompositionstartEvent,
    );
    this.holder.addEventListener(
      'compositionupdate',
      this.handleCompositionupdateEvent,
    );
    this.holder.addEventListener(
      'compositionend',
      this.handleCompositionendEvent,
    );
    this.holder.addEventListener('input', this.handleInputEvent);
    this.holder.addEventListener('mouseup', this.handleMouseupEvent);
  }
}
