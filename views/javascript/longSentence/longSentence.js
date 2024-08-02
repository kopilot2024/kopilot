import { fetchServer } from '../utils/fetchServer.js';
import { showSuggestion } from './popup.js';

export class LongSentence {
  static #instance;
  #length = 100;
  #numOfLongSentence = 0;
  #count;

  constructor() {
    if (LongSentence.#instance) {
      return LongSentence.#instance;
    }
    this.#count = document.getElementById('longsentence-count');
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

  getLength = () => {
    return this.#length;
  };

  resetCounter = () => {
    this.#numOfLongSentence = 0;
    this.#count.innerText = this.#numOfLongSentence;
  };

  parseSentence = async (sentence) => {
    const url = 'http://localhost:3000/clova/parsed-line';
    const data = {
      text: sentence,
      length: this.#length,
    };

    const response = await fetchServer(
      url,
      'post',
      'json',
      JSON.stringify(data),
      'long sentence error',
    );
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
    const output = document.getElementById('output');
    const text = document.getElementById('textarea').value;

    const sentences = text.match(/[^\.!\?\n\r]+[\.!\?\n\r]+|[^\.!\?\n\r]+$/g);
    let outputContent = '';
    this.resetCounter();
    if (sentences) {
      sentences.forEach((sentence) => {
        if (sentence.length >= this.#length) {
          sentence = '<span class="highlight yellow">' + sentence + '</span>';
          this.#numOfLongSentence++;
        }
        outputContent += sentence;
      });

      output.innerHTML = outputContent.replace(/\n/g, '<br>');
      this.#count.innerText = this.#numOfLongSentence;
      this.setLongSentenceEvent();
    }
  };
}
