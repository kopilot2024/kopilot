import { fetchServer } from '../utils/fetchServer.js';
import { RepetitiveWordPopup } from './popup.js';

export class RepetitiveWord {
  #popup;
  #clickedElemtnt;
  constructor() {
    const repetitiveBtn = document.getElementById('repeative-btn');
    this.#popup = new RepetitiveWordPopup();
    repetitiveBtn.addEventListener('click', async (event) =>
      this.setPopup(event),
    );
  }

  setPopup = async (event) => {
    const text = document.getElementById('textarea').value;

    if (text.length < 200) {
      this.#popup.denyPopup();
      return;
    }
    this.#popup.showLoading(event);
    const words = await this.getRepetitiveWord(text);
    this.#popup.showPopup(words, (words) => {
      this.showWord(words);
    });
  };

  getRepetitiveWord = async (sentence) => {
    const url = 'http://localhost:3000/clova/repeated-word';
    const data = {
      text: sentence,
    };

    const response = await fetchServer(
      url,
      'post',
      'json',
      JSON.stringify(data),
      'repeated word error',
    );
    return await response.json();
  };

  updateSelectedValue = (event) => {
    const textNode = document.createTextNode(event.value);
    this.#clickedElemtnt.replaceWith(textNode);

    const textarea = document.getElementById('textarea');
    const output = document.getElementById('output');
    textarea.value = output.innerText;
  };

  showWord(result) {
    const output = document.getElementById('output');
    const textarea = document.getElementById('textarea');
    let content = output.innerHTML;

    result.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'g');
      content = content.replace(
        regex,
        `<span class="highlight green">${word}</span>`,
      );
    });
    output.innerHTML = content;

    document.querySelectorAll('.highlight.green').forEach((element) => {
      element.addEventListener('click', async (event) => {
        this.#clickedElemtnt = event.target;
        const data = await this.getWords(event);
        this.#popup.showNewWord(data, this.updateSelectedValue);
      });
    });
  }

  getWords = async (event) => {
    const clickedElement = event.target;
    const word = clickedElement.innerText;

    const url = 'http://localhost:3000/clova/partial-modification';
    const body = JSON.stringify({
      input: word,
      command: 'SYNONYM',
      systemMessage: null,
    });

    const response = await fetchServer(
      url,
      'post',
      'json',
      body,
      'partial modification error',
    );
    return await response.json();
  };
}
