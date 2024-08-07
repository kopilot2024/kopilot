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

    this.set(title, '', () => this.hide());
    this.show();
    this.timeout = setTimeout(() => this.hide(), 2000);
  }
}
