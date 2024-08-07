import { spellCheck } from '../spell/spellCheck.js';

class Storage {
  #dbName = 'notesDB'; // DB 이름
  #storeName = 'notes'; // 객체 저장소 이름
  #saveInterval = 10000;
  #db = null; // DB 객체
  #textarea;
  constructor() {
    this.init();
  }

  init() {
    // let request = indexedDB.open(this.#dbName, 1);
    this.#textarea = document.getElementById('textarea');
    // request.onupgradeneeded = (event) => this.#onUpgradeNeeded(event);
    // request.onsuccess = (event) => this.#onDBSuccess(event);

    // this.setupEventListeners();
    this.loadContent();
    this.startAutoSaveLocal();
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

  #onLoadButtonClick(versionListId) {
    this.getAllVersions((versions) => {
      const versionList = document.getElementById(versionListId);
      versionList.innerHTML = '';
      versions.forEach((version) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${version.timestamp}: ${version.content.substring(0, 20)}...`;
        listItem.onclick = () => {
          this.#textarea.value = version.content;
        };
        versionList.appendChild(listItem);
      });
    });
  }

  setupEventListeners() {
    document
      .getElementById('start-button')
      .addEventListener('click', () => this.startAutoSave());
    document
      .getElementById('stop-button')
      .addEventListener('click', () => this.stopAutoSave());
    document
      .getElementById('load-button')
      .addEventListener('click', () => this.#onLoadButtonClick('versionList'));
  }

  // local에 저장하는 부분
  loadContent() {
    const savedContent = localStorage.getItem('latestContent');
    if (savedContent) {
      this.#textarea.value = savedContent;
      spellCheck.performSpellCheck();
    }
  }

  saveContentLocal() {
    localStorage.setItem('latestContent', this.#textarea.value);
  }

  startAutoSaveLocal() {
    this.intervalIdLocal = setInterval(() => {
      this.saveContentLocal();
    }, 3000);
  }
}

export const storage = new Storage();
