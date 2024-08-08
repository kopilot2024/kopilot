import { spellCheck } from '../spell/spellCheck.js';

class AutoStorage {
  #textarea;
  constructor() {
    this.init();
  }

  init() {
    this.#textarea = document.getElementById('textarea');
    this.loadContent();
    this.startAutoSaveLocal();
  }

  async loadContent() {
    const savedContent = localStorage.getItem('latestContent');
    if (savedContent) {
      this.#textarea.value = savedContent;
      await spellCheck.performSpellCheck();
    }
  }

  #saveContentLocal() {
    localStorage.setItem('latestContent', this.#textarea.value);
  }

  startAutoSaveLocal() {
    this.intervalIdLocal = setInterval(() => {
      this.#saveContentLocal();
    }, 3000);
  }
}

export const autoStorage = new AutoStorage();
