import { BYTE_SIZE } from '../constants/byteSize.js';

export class CharCounter {
  static countChar(str) {
    const charCountValue = document.getElementById('charCountValue');
    charCountValue.innerText = str.length;
    const byteCountValue = document.getElementById('byteCountValue');
    byteCountValue.innerText = this.#getByteLength(str);
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
