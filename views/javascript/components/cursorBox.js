import { STYLE } from '../constants/style.js';
import { Tooltip } from './tooltip.js';

export class CursorBox extends Tooltip {
  constructor(holder, anchor) {
    super(holder, anchor);
  }

  show(text) {
    this.updatePosition();
    this.holder.innerText = text;
    this.changeVisibility(STYLE.VISIBILITY.VISIBLE);
  }

  empty() {
    this.holder.innerText = '';
    this.changeVisibility(STYLE.VISIBILITY.HIDDEN);
  }
}
