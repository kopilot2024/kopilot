import { KEY } from '../constants/eventKey.js';

export class KeyChecker {
  static isSentenceTerminated(key) {
    return (
      key === KEY.ENTER ||
      key === KEY.PERIOD ||
      key === KEY.QUESTION_MARK ||
      key === KEY.EXCLAMATION_MARK
    );
  }

  static isArrowKeyEvent(key) {
    return (
      key === KEY.ARROW_LEFT ||
      key === KEY.ARROW_RIGHT ||
      key === KEY.ARROW_UP ||
      key === KEY.ARROW_DOWN
    );
  }
}
