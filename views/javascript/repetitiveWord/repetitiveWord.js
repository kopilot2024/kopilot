import { fetchServer } from '../utils/fetchServer.js';
import { RepetitiveWordPopup } from './popup.js';

const getRepetitiveWord = async (sentence) => {
  const url = 'http://localhost:3000/clova/repeated-word';
  const data = {
    text: sentence,
  };

  const response = await fetchServer(
    url,
    'post',
    'json',
    JSON.stringify(data),
    'repeated word error',
  );
  return await response.json();
};

export class RepetitiveWord {
  constructor() {
    const repetitiveBtn = document.getElementById('repeative-btn');
    const popup = new RepetitiveWordPopup();
    repetitiveBtn.addEventListener('click', async (event) => {
      const text = document.getElementById('textarea').value;

      if (text.length < 200) {
        popup.denyPopup();
        return;
      }
      popup.showLoading(event);
      const words = await getRepetitiveWord(text);
      popup.showPopup(words);
    });
  }
}
