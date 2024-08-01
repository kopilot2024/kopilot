import { BYTE_SIZE } from '../constants/byteSize.js';

export class CharCounter {
  static countChar(element) {
    const charCount = document.getElementById('charCount');
    charCount.textContent = `공백 포함: ${element.value.length}자, Byte 수: ${this.#getByteLength(element.value)}`;
  }

  static #getByteLength(str) {
    let byteSize = 0;

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 2048) {
        byteSize += BYTE_SIZE.BYTE_SIZE_3;
      } else if (charCode >= 128) {
        byteSize += BYTE_SIZE.BYTE_SIZE_2;
      } else {
        byteSize += BYTE_SIZE.BYTE_SIZE_1;
      }
    }

    return byteSize;
  }
}
