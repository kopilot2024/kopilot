import { STYLE } from '../constants/style.js';

export class DomManager {
  static showElement(element, display = STYLE.DISPLAY.FLEX) {
    element.style.display = display;
  }

  static hideElement(element, display = STYLE.DISPLAY.NONE) {
    element.style.display = display;
  }

  static toggleElements(
    element,
    onDisplay = STYLE.DISPLAY.FLEX,
    offDisplay = STYLE.DISPLAY.NONE,
  ) {
    const currDisplay = element.style.display;
    element.style.display = currDisplay === onDisplay ? offDisplay : onDisplay;
  }

  static syncElements(subject, object) {
    object.scrollTop = subject.scrollTop;
    object.scrollLeft = subject.scrollLeft;
  }

  static changeVisibility(element, visibility) {
    element.style.visibility = visibility;
  }

  static changeOpacity(element, opacity) {
    element.style.opacity = opacity;
  }
}
