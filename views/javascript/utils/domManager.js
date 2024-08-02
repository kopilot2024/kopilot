import { STYLE } from '../constants/style.js';

export class DomManager {
  static showElement(element, display = STYLE.DISPLAY.FLEX) {
    element.style.display = display;
  }

  static hideElement(element, display = STYLE.DISPLAY.NONE) {
    element.style.display = display;
  }

  static syncElements(subject, object) {
    object.scrollTop = subject.scrollTop;
    object.scrollLeft = subject.scrollLeft;
  }

  static changeVisibility(element, visibility) {
    element.style.visibility = visibility;
  }
}
