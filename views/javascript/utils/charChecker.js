export class CharChecker {
  static #HANGUL_SYLLABLES_START = 0xac00;
  static #HANGUL_SYLLABLES_END = 0xd7a3;

  static #HANGUL_JAMO_START = 0x1100;
  static #HANGUL_JAMO_END = 0x11ff;

  static #HANGUL_COMPATIBILITY_JAMO_START = 0x3130;
  static #HANGUL_COMPATIBILITY_JAMO_END = 0x318f;

  static isIMECharacter(char) {
    if (!char) {
      return false;
    }

    const code = char.charCodeAt(0);
    return (
      (code >= CharChecker.#HANGUL_SYLLABLES_START &&
        code <= CharChecker.#HANGUL_SYLLABLES_END) ||
      (code >= CharChecker.#HANGUL_JAMO_START &&
        code <= CharChecker.#HANGUL_JAMO_END) ||
      (code >= CharChecker.#HANGUL_COMPATIBILITY_JAMO_START &&
        code <= CharChecker.#HANGUL_COMPATIBILITY_JAMO_END)
    );
  }
}
