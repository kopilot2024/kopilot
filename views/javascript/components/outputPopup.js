import { DomManager } from '../utils/domManager.js';
import { BasePopup } from './basePopup.js';

export class OutputPopup extends BasePopup {
  constructor(title, content, applyCallback) {
    super(
      document.getElementById('output-popup'),
      document.getElementById('overlay'),
    );
    this.set(title, content, applyCallback, () => this.hide());
  }

  hideButton() {
    DomManager.hideElement(this.okBtn);
    DomManager.hideElement(this.cancelBtn);
  }

  showButton() {
    DomManager.showElement(this.okBtn);
    DomManager.showElement(this.cancelBtn);
  }
}
