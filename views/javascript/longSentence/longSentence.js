import { showSuggestion } from './popup.js';

export class LongSentence {
  static #instance;
  #length = 100;
  #numOfLongSentence = 0;

  constructor() {
    if (LongSentence.#instance) {
      return LongSentence.#instance;
    }
    LongSentence.#instance = this;
  }

  static getInstance() {
    if (!LongSentence.#instance) {
      LongSentence.#instance = new LongSentence();
    }
    return LongSentence.#instance;
  }

  setLength = (length) => {
    this.#length = length;
  };

  updateNumOfLongSentence = () => {
    this.#numOfLongSentence++;
  };

  resetNumOfLongSentence = () => {
    this.#numOfLongSentence = 0;
  };

  getLength = () => {
    return this.#length;
  };

  parseSentence = async (sentence) => {
    const url = 'http://localhost:3000/clova/parsed-line';
    const data = {
      text: sentence,
      length: this.#length,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.text();
  };

  changePage = (span, textarea, output) => {
    const parsedText = span.dataset.tooltip;
    const textNode = document.createTextNode(parsedText);
    span.parentNode.replaceChild(textNode, span);
    textarea.value = output.innerText;
  };

  setLongSentenceEvent = () => {
    const tag = document.querySelectorAll('.highlight.yellow');
    tag.forEach((span) => {
      span.addEventListener('click', (event) => {
        showSuggestion(event, span);
      });
    });
  };

  checkLength = () => {
    const count = document.getElementById('longsentence-count');
    const output = document.getElementById('output');
    const text = document.getElementById('textarea').value;

    const sentences = text.match(/[^\.!\?\n\r]+[\.!\?\n\r]+|[^\.!\?\n\r]+$/g);
    let outputContent = '';
    count.innerText = '긴 문장';
    this.resetNumOfLongSentence();
    if (sentences) {
      sentences.forEach((sentence) => {
        if (sentence.length >= this.#length) {
          sentence = '<span class="highlight yellow">' + sentence + '</span>';
          this.updateNumOfLongSentence();
        }
        outputContent += sentence;

        if (this.#numOfLongSentence > 0) {
          count.innerText = `긴 문장 ${this.#numOfLongSentence}개`;
        }
      });

      output.innerHTML = outputContent.replace(/\n/g, '<br>');
      this.setLongSentenceEvent();
    }
  };
}
