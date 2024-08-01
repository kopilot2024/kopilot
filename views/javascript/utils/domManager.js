import { STYLE } from '../constants/style.js';

export class DomManager {
  static showElement(child, display = STYLE.DISPLAY.FLEX) {
    child.style.display = display;
  }

  static hideElement(child, display = STYLE.DISPLAY.NONE) {
    child.style.display = display;
  }
}
