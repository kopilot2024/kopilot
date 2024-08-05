import { BaseComponent } from './baseComponent.js';

export class BaseSlide extends BaseComponent {
  constructor(holder) {
    super(holder);
  }

  toggle() {
    this.holder.classList.toggle('active');
  }
}
