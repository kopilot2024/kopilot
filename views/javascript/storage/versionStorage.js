import { spellCheck } from '../spell/spellCheck.js';
import { CharCounter } from '../utils/charCounter.js';

class VersionStorage {
  #DB_NAME = 'kopilotDB'; // DB 이름
  #STORE_NAME = 'kopilot'; // 객체 저장소 이름
  #SAVE_INTERNAL = 60000; // 1분
  #ITEM_COUNT = 10; // 10개만 저장하기
  #OPTIONS = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
    hour12: true,
  };

  #db = null; // DB 객체
  #textarea;
  #versionList;

  constructor() {
    this.#init();
  }

  #init() {
    this.#textarea = document.getElementById('textarea');
    this.#versionList = document.getElementById('version-list');

    this.#openDB();
    this.#setEvent();
    this.#startAutoSave();
  }

  #openDB() {
    const request = indexedDB.open(this.#DB_NAME, 1);
    request.onupgradeneeded = (event) => this.#onUpgradeNeeded(event);
    request.onsuccess = (event) => this.#onDBSuccess(event);
  }

  // 처음 만들어지거나 버전이 변경될 때
  #onUpgradeNeeded(event) {
    this.#db = event.target.result;
    if (!this.#db.objectSTORE_NAMEs.contains(this.#STORE_NAME)) {
      const objectStore = this.#db.createObjectStore(this.#STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      objectStore.createIndex('timestamp', 'timestamp', { unique: false });
    }
  }

  // 여는데 성공하면 DB 객체에 저장하기
  #onDBSuccess(event) {
    this.#db = event.target.result;
  }

  // indexDB에 접근하는 함수가 async/await을 지원 안해서 변환 함수
  #asyncRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  #asyncCursor(objectStore, direction = 'next', action = (cursor) => cursor) {
    return new Promise((resolve, reject) => {
      const request = objectStore.openCursor(null, direction);

      request.onsuccess = async (event) => {
        const cursor = await event.target.result;
        if (!cursor) {
          resolve(null);
          return;
        }
        this.#handleCursorSuccess(cursor, action, resolve, reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async #handleCursorSuccess(cursor, action, resolve, reject) {
    try {
      const result = await action(cursor);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  // prev로 최신 버전을 가져오기
  #getLatestVersion(objectStore) {
    return this.#asyncCursor(objectStore, 'prev', (cursor) => cursor.value);
  }

  // next로 오래된 버전을 가져와서 삭제
  #deleteOldestItem(objectStore) {
    return this.#asyncCursor(objectStore, 'next', (cursor) =>
      this.#asyncRequest(cursor.delete()),
    );
  }

  async saveContent(content) {
    try {
      const transaction = this.#db.transaction([this.#STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(this.#STORE_NAME);

      // 1. 최신 항목을 가져와서 비교
      const latestVersion = await this.#getLatestVersion(objectStore);
      if (latestVersion && latestVersion.content === content) {
        return; // 새 항목이 최신 버전과 동일하면 저장하지 않음
      }

      // 2. 항목 수를 확인하고 오래된 항목 삭제
      const count = await this.#asyncRequest(objectStore.count());
      if (count >= this.#ITEM_COUNT) {
        await this.#deleteOldestItem(objectStore);
      }

      // 3. 새 항목 추가
      await this.#asyncRequest(
        objectStore.add({
          content: content,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error('Failed to save content', error);
    }
  }

  #startAutoSave() {
    this.intervalId = setInterval(async () => {
      const content = this.#textarea.value;
      await this.saveContent(content);
    }, this.#SAVE_INTERNAL);
  }

  async #getAllVersions() {
    const transaction = this.#db.transaction([this.#STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(this.#STORE_NAME);
    return this.#asyncRequest(objectStore.getAll());
  }

  async #onLoadButtonClick() {
    try {
      const versions = await this.#getAllVersions();
      this.#versionList.innerHTML = '';
      versions.reverse().forEach((version) => this.#drawVersion(version));
    } catch (error) {
      console.error('Failed to load versions', error);
    }
  }

  #drawVersion(version) {
    const listItem = document.createElement('li');
    listItem.textContent = this.#formatTimestamp(version.timestamp);
    listItem.onclick = () => {
      this.#textarea.value = version.content;
      spellCheck.performSpellCheck();
      CharCounter.updateTextareaCounter(this.#textarea.value);
    };
    this.#versionList.appendChild(listItem);
  }

  #formatTimestamp(isoTimestamp) {
    return new Date(isoTimestamp).toLocaleString('ko-KR', this.#OPTIONS);
  }

  #setEvent() {
    document
      .getElementById('load-button')
      .addEventListener('click', (event) => {
        this.#onLoadButtonClick();
        const popup = document.getElementById('storage-popup');
        const button = event.target;
        const rect = button.getBoundingClientRect();
        const width = 13; // 13rem

        popup.style.top = rect.bottom + window.scrollY + 2 + 'px';
        popup.style.left = rect.right - width * 16 + window.scrollX + 'px';
        popup.style.display = 'block';
      });

    document.getElementById('cancel-button').addEventListener('click', () => {
      const popup = document.getElementById('storage-popup');
      popup.style.display = 'none';
    });
  }
}
export const versionStorage = new VersionStorage();
