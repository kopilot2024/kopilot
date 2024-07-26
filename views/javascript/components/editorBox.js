export class EditorBox {
  #holder;
  #input;
  #applyBtn;
  #cancelBtn;
  #clovaResult;

  constructor(applyCallback) {
    this.#holder = document.getElementById('editor-box');
    this.#init(applyCallback);
  }

  show(text, command, value) {
    const h4 = this.#holder.querySelector('h4');
    h4.innerHTML = `"<span>${text}</span>"을(를) "<span>${value}</span>"중이에요!`;

    this.#initInput();

    this.#requestApi(text, command);
    this.#holder.style.display = 'flex';
  }

  hide() {
    this.#holder.style.display = 'none';
  }

  #init(applyCallback) {
    this.#input = this.#holder.querySelector('input');

    this.#applyBtn = this.#holder.querySelector('#clova-apply-btn');
    this.#applyBtn.addEventListener('click', () =>
      applyCallback(this.#clovaResult),
    );

    this.#cancelBtn = this.#holder.querySelector('#clova-cancel-btn');
    this.#cancelBtn.addEventListener('click', () => this.hide());
  }

  #initInput() {
    this.#applyBtn.style.display = 'none';
    this.#input.value = '결과를 생성 중이에요. 잠시만 기다려주세요.';
  }

  async #requestApi(input, command) {
    try {
      const res = await fetch(
        'http://localhost:3000/clova/partial-modification',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, command }),
        },
      );

      if (!res.ok) {
        throw new Error('TODO 에러 핸들링');
      }

      const data = await res.json();

      this.#clovaResult = data.result;
      this.#input.value = data.result;
      this.#applyBtn.style.display = 'flex';
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
