import { OutputPopup } from '../components/outputPopup.js';
import { RadioBtnGroup } from '../components/radioBtnGroup.js';

export class RepetitiveWordPopup {
  #popup;
  #radioBtn;

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

  showPopup(result, func) {
    this.#popup.set(
      '반복되는 단어는 다음과 같습니다.',
      result.join(', '),
      () => {
        func(result);
        this.#popup.hide();
      },
    );
    this.#popup.showButton();
  }

  denyPopup() {
    this.#popup.set('글이 너무 짧습니다.', '글을 조금 더 입력해주세요.', null);
    this.#popup.show();
    this.#popup.hideApplyButton();
  }

  getSelectedWord = () => {
    return this.#radioBtn.getSelectedBtn();
  };

  showNewWord = (data, func) => {
    const holder = this.#popup.holder.querySelector('.radio-btn-group');
    this.#radioBtn = new RadioBtnGroup(holder);
    this.#radioBtn.addButtons(data.result, 'repetitive');

    this.#popup.set('다음 단어로 바꿔보세요.', null, () => {
      func(this.#radioBtn.getSelectedBtn());
      this.#popup.hide();
    });
    this.#popup.show();
  };
}
