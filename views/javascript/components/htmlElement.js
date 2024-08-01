export class HtmlElement {
  holder;

  static #FLEX = 'flex';
  static #NONE = 'none';

  constructor(holder) {
    this.holder = holder;
  }

  static showChild(child, display = HtmlElement.#FLEX) {
    child.style.display = display;
  }

  static hideChild(child, display = HtmlElement.#NONE) {
    child.style.display = display;
  }

  show(display = HtmlElement.#FLEX) {
    this.holder.style.display = display;
  }

  hide(display = HtmlElement.#NONE) {
    this.holder.style.display = display;
  }

  changeVisibility(visibility) {
    this.holder.style.visibility = visibility;
  }
}
