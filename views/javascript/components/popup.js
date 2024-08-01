import { HtmlElement } from './htmlElement.js';

export class Popup extends HtmlElement {
  overlay;

  constructor(holder, overlay) {
    super(holder);
    this.overlay = overlay;
  }

  show() {
    super.show();
    HtmlElement.showChild(this.overlay);
  }

  hide() {
    super.hide();
    HtmlElement.hideChild(this.overlay);
  }
}
