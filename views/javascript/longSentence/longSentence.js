import { showSuggestion } from './popup.js';

export class LongSentence {
  static #length = 100;

  static setLength = (length) => {
    this.#length = length;
  };

  static getLength = () => {
    return this.#length;
  };

  static parseSentence = async (sentence) => {
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

  static changePage = (span, textarea, output) => {
    const parsedText = span.dataset.tooltip;
    const textNode = document.createTextNode(parsedText);
    span.parentNode.replaceChild(textNode, span);
    textarea.value = output.innerText;
  };

  static setLongSentenceEvent = () => {
    const tag = document.querySelectorAll('.highlight.yellow');
    tag.forEach((span) => {
      span.addEventListener('click', (event) => {
        showSuggestion(event, span);
      });
    });
  };

  static checkLength = () => {
    const textarea = document.getElementById('textarea');
    const output = document.getElementById('output');

    const text = textarea.value;
    const sentences = text.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g);
    let outputContent = '';
    if (sentences) {
      sentences.forEach((sentence) => {
        if (sentence.length >= this.#length) {
          sentence = '<span class="highlight yellow">' + sentence + '</span>';
        }
        outputContent += sentence;
      });

      output.innerHTML = outputContent.replace(/\n/g, '<br>');
      this.setLongSentenceEvent();
    }
  };
}
