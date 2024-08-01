import { STYLE } from '../constants/style.js';

export class BaseComponent {
  holder;

  constructor(holder) {
    this.holder = holder;
  }

  show(display = STYLE.DISPLAY.FLEX) {
    this.holder.style.display = display;
  }

  hide(display = STYLE.DISPLAY.NONE) {
    this.holder.style.display = display;
  }

  changeVisibility(visibility) {
    this.holder.style.visibility = visibility;
  }
}
