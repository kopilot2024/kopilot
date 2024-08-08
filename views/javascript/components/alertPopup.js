import { BasePopup } from './basePopup.js';

export class AlertPopup extends BasePopup {
  timeout;

  constructor(holder) {
    super(holder);
  }

  pop(title) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.set(title, '', () => this.hide(false));
    this.show();
    this.timeout = setTimeout(() => this.hide(false), 2000);
  }
}
