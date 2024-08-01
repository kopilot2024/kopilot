import { LongSentence } from '../longSentence/longSentence.js';
import { showSuggestion } from './popup.js';

class SpellCheck {
  #spellErrors = [];

  async fetchServer(sentence) {
    const URL = 'http://localhost:3000/spell';
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ sentence }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error during spell check:', error);
      throw error;
    }
  }

  setSpellHightlight() {
    let index = 0;
    const output = document.getElementById('output');
    let content = output.innerHTML;

    this.#spellErrors.forEach((error) => {
      const token = error.token;
      const suggestions = error.suggestions.join(', ');
      const info = error.info.replace(/\n/g, ' ').replace(/'/g, '`');

      const tokenIndex = content.indexOf(token, index);
      if (tokenIndex !== -1) {
        const span = `<span class="highlight red" data-suggestions="${suggestions}" data-info="${info}">${token}</span>`;
        content =
          content.substring(0, tokenIndex) +
          span +
          content.substring(tokenIndex + token.length);
        index = tokenIndex + span.length + 1;
      }
    });

    // 줄바꿈 유지하여 결과를 div에 추가
    output.innerHTML = content.replace(/\n/g, '<br>');
    this.setSpellEvent();
    this.updateErrorCount();
  }

  setSpellEvent() {
    document.querySelectorAll('.highlight.red').forEach((element) => {
      element.addEventListener('click', (event) => {
        showSuggestion(
          event,
          element,
          element.getAttribute('data-suggestions'),
          element.getAttribute('data-info'),
        );
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

  async updateSpellErrors() {
    const inputText = document.getElementById('output').innerHTML;
    this.#spellErrors = await this.fetchServer(
      inputText.replace(/<\/?span[^>]*>/gi, ''),
    );
  }

  async performSpellCheck() {
    LongSentence.checkLength();
    this.updateSpellErrors();
    this.setSpellHightlight();
    LongSentence.setLongSentenceEvent();
  }

  spellCheckOnPunctuation = this.#debounce(() => this.performSpellCheck(), 100);
  spellCheckOnContinuousInput = this.#throttle(
    () => this.performSpellCheck(),
    1000,
  );

  updateErrorCount() {
    const errorCountElement = document.getElementById('error-count');
    if (errorCountElement) {
      errorCountElement.innerText = this.getErrorCount();
    }
  }

  getErrorCount() {
    return this.#spellErrors.length;
  }
}

export const spellCheck = new SpellCheck();
