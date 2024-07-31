import { LongSentence } from '../longSentence/longSentence.js';
import { showSuggestion } from './popup.js';

class SpellCheck {
  #debounceTimer;
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
    if (this.#spellErrors.length === 0) {
      return;
    }

    let index = 0;
    const output = document.getElementById('output');
    let content = output.innerHTML;
    output.innerHTML = ''; // 기존 내용 초기화

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
        index = tokenIndex + span.length;
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

  debounce(fn, delay) {
    return (...args) => {
      clearTimeout(this.#debounceTimer);
      this.#debounceTimer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  spellCheck = this.debounce(async () => {
    LongSentence.checkLength();
    const inputText = document.getElementById('output').innerHTML;
    this.#spellErrors = await this.fetchServer(
      inputText.replace(/<\/?span[^>]*>/gi, ''),
    );
    this.setSpellHightlight();
    LongSentence.setLongSentenceEvent();
  }, 100);

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
