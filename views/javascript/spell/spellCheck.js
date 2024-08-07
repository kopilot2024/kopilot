import { LongSentence } from '../longSentence/longSentence.js';
import { fetchServer } from '../utils/fetchServer.js';
import { showSuggestion } from './popup.js';

class SpellCheck {
  #spellErrors = [];
  #output = document.getElementById('output');
  #textarea = document.getElementById('textarea');
  #errorCount = document.getElementById('error-count');

  setSpellHighlight() {
    let index = 0;
    let content = this.#output.innerHTML;
    if (content.includes('highlight red')) {
      return;
    }

    this.#spellErrors.forEach((error) => {
      const token = error.token;
      const suggestions = error.suggestions.join(', ');

      const tokenIndex = content.indexOf(token, index);
      if (tokenIndex !== -1) {
        const span = `<span class="highlight red" data-suggestions="${suggestions}">${token}</span>`;
        content =
          content.substring(0, tokenIndex) +
          span +
          content.substring(tokenIndex + token.length);
        index = tokenIndex + span.length + 1;
      }
    });

    // 줄바꿈 유지하여 결과를 div에 추가
    this.#output.innerHTML = content.replace(/\n/g, '<br>');
    this.#setSpellEvent();
    this.#updateErrorCount();
  }

  #setSpellEvent() {
    document.querySelectorAll('.highlight.red').forEach((element, idx) => {
      element.addEventListener('click', (event) => {
        showSuggestion(event, element, idx);
      });
    });
  }

  #debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  #throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  async #updateSpellErrors() {
    const inputText = this.#output.innerHTML;

    const sentence = inputText.replace(/<\/?span[^>]*>/gi, '');

    const url = 'http://localhost:3000/spell';
    const response = await fetchServer(
      url,
      'post',
      'x-www-form-urlencoded',
      new URLSearchParams({ sentence }),
      'spell error',
    );
    this.#spellErrors = await response.json();
    // 삭제하기 위해 index 추가
    this.#spellErrors = this.#spellErrors.map((error, idx) => {
      return { ...error, idx };
    });
  }

  async performSpellCheck() {
    this.#output.innerHTML = this.#textarea.value;
    const longSentence = LongSentence.getInstance();
    longSentence.checkLength();
    await this.#updateSpellErrors();
    this.setSpellHighlight();
    longSentence.setLongSentenceEvent();
  }

  spellCheckOnPunctuation = this.#debounce(() => this.performSpellCheck(), 100);
  spellCheckOnContinuousInput = this.#throttle(
    () => this.performSpellCheck(),
    1000,
  );

  #updateErrorCount() {
    this.#errorCount.innerText = this.#getErrorCount();
  }

  #getErrorCount() {
    return this.#spellErrors.length;
  }

  removeErrorByIndex(idx) {
    this.#spellErrors = this.#spellErrors.filter((error) => error.idx !== idx);
    this.#updateErrorCount();
  }
}

export const spellCheck = new SpellCheck();
