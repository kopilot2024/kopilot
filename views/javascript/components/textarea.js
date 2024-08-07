import { KEY } from '../constants/eventKey.js';
import { LongSentence } from '../longSentence/longSentence.js';
import { spellCheck } from '../spell/spellCheck.js';
import { storage } from '../storage/storage.js';
import { CharChecker } from '../utils/charChecker.js';
import { CharCounter } from '../utils/charCounter.js';
import { KeyChecker } from '../utils/keyChecker.js';
import { BaseComponent } from './baseComponent.js';

export class Textarea extends BaseComponent {
  #output;
  #autoCompleteSettings;
  #writingTool;
  #nextCursorPointer;
  #longSentence;

  constructor(holder, autoCompleteSettings, writingTool) {
    super(holder);
    this.#output = document.getElementById('output');
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

    this.#output.innerHTML = this.holder.value;

    if (!event.isComposing && CharChecker.isIMECharacter(event.data)) {
      this.#removeLastCharacter();
      this.#restoreNextCursorPointer();
      event.preventDefault();
    }

    CharCounter.updateTextareaCounter(this.holder.value);
    this.#longSentence.checkLength();
    spellCheck.setSpellHighlight();
    this.#longSentence.setLongSentenceEvent();
  }

  handleKeydownEvent(event) {
    const code = event.code;
    const key = event.key;

    // if (event.ctrlKey && event.key === 's') {
    //   event.preventDefault();
    //   storage.saveContent(this.holder.value);
    //   alert('내용이 저장되었습니다.');
    // }

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

    this.#writingTool.show(selectedText, start, end);
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
    const currLength = this.holder.value.length;
    this.holder.value = this.holder.value.substring(0, currLength - 1);
  }

  #setNextCursorPointer(currPointer, phrase) {
    this.#nextCursorPointer = currPointer + phrase.length;
  }

  #restoreNextCursorPointer() {
    this.holder.selectionStart = this.#nextCursorPointer;
    this.holder.selectionEnd = this.#nextCursorPointer;
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
