import { Tooltip } from './tooltip.js';

export class CursorBox extends Tooltip {
  constructor(holder, anchor) {
    super(holder, anchor);
  }

  show(text) {
    this.updatePosition();
    this.holder.innerText = text;
    this.holder.style.visibility = 'visible';
  }

  empty() {
    this.holder.innerText = '';
    this.holder.style.visibility = 'hidden';
  }
}
