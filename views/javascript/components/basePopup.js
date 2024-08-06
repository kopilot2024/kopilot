import { DomManager } from '../utils/domManager.js';
import { BaseComponent } from './baseComponent.js';

export class BasePopup extends BaseComponent {
  overlay;

  constructor(holder, overlay) {
    super(holder);
    this.overlay = overlay;
  }

  show() {
    super.show();
    DomManager.showElement(this.overlay);
  }

  hide(overlayHide = true) {
    super.hide();
    if (overlayHide) {
      DomManager.hideElement(this.overlay);
    }
  }
}
