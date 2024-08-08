import { AlertPopup } from '../components/alertPopup.js';

const SPACE = '&nbsp;';

export class InputNumberChecker {
  static #alertPopup = new AlertPopup(
    document.getElementById('main-alert-popup'),
  );

  static validate(input, min, max) {
    input.addEventListener('change', () => {
      const val = parseInt(input.value);

      if (val >= min && val <= max) {
        input.classList.remove('wrong');
        return;
      }

      this.#alertPopup.pop(
        `
        <span class='em'>${min}</span>과${SPACE}
        <span class='em'>${max}</span> 사이의 값을 입력해주세요.`,
      );
      input.value = val < min ? min : max;
      input.classList.add('wrong');
    });
  }
}
