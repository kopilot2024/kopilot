import {
  formalEndingMap,
  plainEndingMap,
  politeEndingMap,
} from '../constants/endingMap.js';

const INITIAL_POINTER = 0;

export class AutoCompleteSettings {
  #endingMap = formalEndingMap;
  #char = '';
  #word = '';
  #pointer = INITIAL_POINTER;
  #cursorBox;

  constructor(cursorBox) {
    this.#cursorBox = cursorBox;
  }

  getEnding() {
    return this.#getEndingWithWord() ?? this.#getEndingWithLastChar();
  }

  #getEndingWithWord() {
    return this.#endingMap[this.#word];
  }

  #getEndingWithLastChar() {
    return this.#endingMap[this.#getLastChar()];
  }

  hasEnding() {
    return this.getEnding() ? true : false;
  }

  setEndingType(selected) {
    this.#endingMap =
      selected === 'formal'
        ? formalEndingMap
        : selected === 'polite'
          ? politeEndingMap
          : plainEndingMap;
  }

  hasChar() {
    return this.#char;
  }

  emptyChar() {
    this.#char = '';
  }

  updateChar(char) {
    this.#char = char;
  }

  backspaceChar() {
    this.#char = this.#char.slice(0, -1);
  }

  #emptyWord() {
    this.#word = '';
  }

  updateWord(char) {
    this.#word += char;
    this.emptyChar();
  }

  #getLastChar() {
    return this.#word.slice(-1) || null;
  }

  backspaceWord() {
    this.#word = this.#word.slice(0, -1);
    if (!this.hasEnding()) {
      this.emptyCursorBox();
    }
  }

  getPointer() {
    return this.#pointer;
  }

  #setPointer(pointer) {
    this.#pointer = pointer;
  }

  #emptyPointer() {
    this.#pointer = INITIAL_POINTER;
  }

  emptyBuffers() {
    this.#emptyWord();
    this.emptyChar();
    this.#emptyPointer();
  }

  showCursorBox(pointer) {
    this.#setPointer(pointer);
    this.#cursorBox.show(this.getEnding());
  }

  emptyCursorBox() {
    this.#cursorBox.empty();
  }

  emptyAll() {
    this.emptyCursorBox();
    this.emptyBuffers();
  }
}
