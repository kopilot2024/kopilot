import { spellCheck } from '../spell/spellCheck.js';

class VersionStorage {
  #dbName = 'notesDB'; // DB 이름
  #storeName = 'notes'; // 객체 저장소 이름
  #saveInterval = 10000;
  #db = null; // DB 객체
  #textarea;
  #versionList;
  constructor() {
    this.init();
  }

  init() {
    let request = indexedDB.open(this.#dbName, 1);
    this.#textarea = document.getElementById('textarea');
    this.#versionList = document.getElementById('version-list');
    request.onupgradeneeded = (event) => this.#onUpgradeNeeded(event);
    request.onsuccess = (event) => this.#onDBSuccess(event);

    this.setEvent();
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

  saveContent(content) {
    let transaction = this.#db.transaction([this.#storeName], 'readwrite'); // 시작
    let objectStore = transaction.objectStore(this.#storeName);
    let timestamp = new Date().toISOString();
    objectStore.add({ content: content, timestamp: timestamp });
  }

  startAutoSave() {
    this.intervalId = setInterval(() => {
      const content = this.#textarea.value;
      this.saveContent(content);
    }, this.#saveInterval);
  }

  stopAutoSave() {
    clearInterval(this.intervalId);
  }

  // 모든 버전 callback으로 전달하기
  getAllVersions(callback) {
    let transaction = this.#db.transaction([this.#storeName]);
    let objectStore = transaction.objectStore(this.#storeName);
    let request = objectStore.getAll();

    request.onsuccess = () => this.#onGetAllVersionsSuccess(request, callback);
  }

  #onGetAllVersionsSuccess(request, callback) {
    callback(request.result);
  }

  #onLoadButtonClick() {
    this.getAllVersions((versions) => {
      this.#versionList.innerHTML = '';
      versions.forEach((version) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${version.timestamp}: ${version.content.substring(0, 20)}...`;
        listItem.onclick = () => {
          this.#textarea.value = version.content;
        };
        this.#versionList.appendChild(listItem);
      });
    });
  }

  setEvent() {
    document
      .getElementById('load-button')
      .addEventListener('click', (event) => {
        this.#onLoadButtonClick();
        const popup = document.getElementById('storage-popup');
        const button = event.target;
        const rect = button.getBoundingClientRect();
        // 팝업의 위치를 버튼의 바로 아래로 설정
        popup.style.top = rect.bottom + window.scrollY + 'px';
        popup.style.left = rect.left + window.scrollX + 'px';
        popup.style.display = 'block';
      });
  }
}
export const versionStorage = new VersionStorage();
