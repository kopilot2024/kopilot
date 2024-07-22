export class Popup {
  holder;
  overlay;

  constructor(holder, overlay) {
    this.holder = holder;
    this.overlay = overlay;
  }

  show() {
    this.holder.style.display = 'flex';
    this.overlay.style.display = 'flex';
  }

  hide() {
    this.holder.style.display = 'none';
    this.overlay.style.display = 'none';
  }
}
