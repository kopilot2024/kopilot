import { spellCheck } from '../spell/spellCheck.js';
import { CharCounter } from '../utils/charCounter.js';

class VersionStorage {
  #dbName = 'kopilotDB'; // DB 이름
  #storeName = 'kopilot'; // 객체 저장소 이름
  #saveInterval = 60000; // 1분
  #db = null; // DB 객체
  #textarea;
  #versionList;
  #options = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
    hour12: true,
  };

  constructor() {
    this.init();
  }

  init() {
    this.#textarea = document.getElementById('textarea');
    this.#versionList = document.getElementById('version-list');

    this.#openDB();
    this.#setEvent();
    this.#startAutoSave();
  }

  #openDB() {
    let request = indexedDB.open(this.#dbName, 1);
    request.onupgradeneeded = (event) => this.#onUpgradeNeeded(event);
    request.onsuccess = (event) => this.#onDBSuccess(event);
  }

  // 처음 만들어지거나 버전이 변경될 때
  #onUpgradeNeeded(event) {
    this.#db = event.target.result;
    if (!this.#db.objectStoreNames.contains(this.#storeName)) {
      let objectStore = this.#db.createObjectStore(this.#storeName, {
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
  #promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  #promisifyCursorRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resolve(cursor);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  #getLatestVersion(objectStore) {
    return new Promise((resolve, reject) => {
      const request = objectStore.openCursor(null, 'prev'); // 'prev'로 최신 항목을 가져옴
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resolve(cursor.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveContent(content) {
    try {
      const transaction = this.#db.transaction([this.#storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.#storeName);

      // 1. 최신 항목을 가져와서 비교
      const latestVersion = await this.#getLatestVersion(objectStore);
      if (latestVersion && latestVersion.content === content) {
        return; // 새 항목이 최신 버전과 동일하면 저장하지 않음
      }

      // 2. 항목 수를 확인하고 오래된 항목 삭제
      const count = await this.#promisifyRequest(objectStore.count());
      if (count >= 10) {
        const cursor = await this.#promisifyCursorRequest(
          objectStore.openCursor(),
        );
        if (cursor) {
          await this.#promisifyRequest(cursor.delete());
        }
      }

      // 3. 새 항목 추가
      await this.#promisifyRequest(
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
    }, this.#saveInterval);
  }

  async #getAllVersions() {
    const transaction = this.#db.transaction([this.#storeName], 'readonly');
    const objectStore = transaction.objectStore(this.#storeName);
    return this.#promisifyRequest(objectStore.getAll());
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
    return new Date(isoTimestamp).toLocaleString('ko-KR', this.#options);
  }

  #setEvent() {
    document
      .getElementById('load-button')
      .addEventListener('click', (event) => {
        this.#onLoadButtonClick();
        const popup = document.getElementById('storage-popup');
        const button = event.target;
        const rect = button.getBoundingClientRect();

        popup.style.top = rect.bottom + window.scrollY + 'px';
        popup.style.left = rect.right - 15 * 16 + window.scrollX + 'px';
        popup.style.display = 'block';
      });

    document.getElementById('cancel-button').addEventListener('click', () => {
      const popup = document.getElementById('storage-popup');
      popup.style.display = 'none';
    });
  }
}
export const versionStorage = new VersionStorage();
