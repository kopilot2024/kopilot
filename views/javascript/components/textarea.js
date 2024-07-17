export class Textarea {
  #holder;
  #autoCompleteSettings;
  #nextCursorPointer;

  constructor(holder, autoCompleteSettings) {
    this.#holder = holder;
    this.#autoCompleteSettings = autoCompleteSettings;
    this.#init();
  }

  changeEndingType(key) {
    this.#autoCompleteSettings.setEndingType(key);
  }

  static isArrowKeyEvent(key) {
    return (
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown'
    );
  }

  static isAutoCompletePosition(currPointer, autoPointer) {
    return currPointer === autoPointer || currPointer === autoPointer + 1;
  }

  static isIMECharacter(char) {
    const code = char.charCodeAt(0);
    return (
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0x1100 && code <= 0x11ff) ||
      (code >= 0x3130 && code <= 0x318f)
    );
  }

  handleInputEvent(event) {
    if (!event.isComposing && Textarea.isIMECharacter(event.data)) {
      this.#removeLastCharacter();
      this.#restoreNextCursorPointer();
      event.preventDefault();
    }
  }

  handleKeydownEvent(event) {
    const code = event.code;
    const key = event.key;

    const cursorPointer = this.#getCursorPointer();
    const autoPointer = this.#autoCompleteSettings.getPointer();

    if (!Textarea.isAutoCompletePosition(cursorPointer, autoPointer)) {
      this.#autoCompleteSettings.emptyCursorBox();
    }

    if (code === 'Backspace') {
      this.handleBackspace();
      return;
    }
    if (
      (code === 'Space' && key !== 'Process') ||
      code === 'Enter' ||
      Textarea.isArrowKeyEvent(code)
    ) {
      this.#autoCompleteSettings.emptyAll();
      return;
    }

    if (code === 'Tab') {
      event.preventDefault();

      if (key !== 'Process') {
        return;
      }

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

    if (
      key === 'Enter' ||
      key === '.' ||
      key === '?' ||
      key === '!'
    ) {
      spellCheck(event.key);
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

  handleBackspace() {
    if (this.#autoCompleteSettings.hasChar()) {
      this.#autoCompleteSettings.backspaceChar();
      return;
    }
    this.#autoCompleteSettings.backspaceWord();
  }

  #init() {
    this.handleKeydownEvent = this.handleKeydownEvent.bind(this);
    this.handleCompositionstartEvent =
      this.handleCompositionstartEvent.bind(this);
    this.handleCompositionupdateEvent =
      this.handleCompositionupdateEvent.bind(this);
    this.handleCompositionendEvent = this.handleCompositionendEvent.bind(this);
    this.handleInputEvent = this.handleInputEvent.bind(this);

    this.#holder.addEventListener('keydown', this.handleKeydownEvent);
    this.#holder.addEventListener(
      'compositionstart',
      this.handleCompositionstartEvent,
    );
    this.#holder.addEventListener(
      'compositionupdate',
      this.handleCompositionupdateEvent,
    );
    this.#holder.addEventListener(
      'compositionend',
      this.handleCompositionendEvent,
    );
    this.#holder.addEventListener('input', this.handleInputEvent);
  }

  #getCursorPointer() {
    return this.#holder.selectionStart;
  }

  #insertPhrase(pointer, phrase) {
    const before = this.#holder.value.substring(0, pointer);
    const after = this.#holder.value.substring(pointer);

    this.#holder.value = before + phrase + after;
  }

  #removeIncompleteCharacter(autoPointer) {
    const before = this.#holder.value.substring(0, autoPointer);
    const after = this.#holder.value.substring(autoPointer + 1);

    this.#holder.value = before + after;
  }

  #removeLastCharacter() {
    const currLen = this.#holder.value.length;
    this.#holder.value = this.#holder.value.substring(0, currLen - 1);
  }

  #setNextCursorPointer(currPointer, phrase) {
    this.#nextCursorPointer = currPointer + phrase.length;
  }

  #restoreNextCursorPointer() {
    this.#holder.selectionStart = this.#nextCursorPointer;
    this.#holder.selectionEnd = this.#nextCursorPointer;
  }
}
