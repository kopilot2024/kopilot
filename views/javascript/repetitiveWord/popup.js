import { OutputPopup } from '../components/outputPopup.js';

export class RepetitiveWordPopup {
  #popup;

  constructor() {
    this.#popup = new OutputPopup();
  }

  showLoading(event) {
    event.stopPropagation(); // 이벤트 전파 막기

    this.#popup.set(
      '반복되는 단어를 탐지 중입니다...',
      `
    <div class="spinner-wrap">
      <div class="spinner">
      </div>
    </div>`,
      null,
    );
    this.#popup.show();
    this.#popup.hideButton();
  }

  showPopup(result) {
    this.#popup.set(
      '반복되는 단어는 다음과 같습니다.',
      result.join(', '),
      () => {
        this.showWord(result);
      },
    );
    this.#popup.showButton();
  }

  denyPopup() {
    this.#popup.set('글이 너무 짧습니다.', '글을 조금 더 입력해주세요.', null);
    this.#popup.show();
    this.#popup.hideApplyButton();
  }

  showWord(result) {
    const output = document.getElementById('output');
    let content = output.innerHTML;

    result.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'g');
      content = content.replace(
        regex,
        `<span class="highlight green">${word}</span>`,
      );
    });
    output.innerHTML = content;
    this.#popup.hide();
  }
}
