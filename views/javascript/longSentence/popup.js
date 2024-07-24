import { OutputPopup } from '../components/outputPopup.js';
import { parseSentence } from './longSentence.js';

export async function showSuggestion(event, span) {
  event.stopPropagation(); // 이벤트 전파 막기

  const outputPopup = new OutputPopup('긴 문장을 분석 중입니다...', '', null);
  outputPopup.show();
  const outputContent = document.getElementById('output-popup-content');
  outputContent.innerHTML = `
    <div class="spinner-wrap">
      <div class="spinner">
      </div>
    </div>`;
  outputPopup.hideButton();

  const suggestion = await parseSentence(span.innerText);
  outputPopup.set('긴 문장을 다음과 같이 수정해보세요.', suggestion, () => {
    span.outerHTML = suggestion;
    const output = document.getElementById('output');
    const textarea = document.getElementById('textarea');
    textarea.value = output.innerText;
    outputPopup.hide();
    textarea.focus(); // 커서를 textarea로 이동
  });
  outputPopup.showButton();
}
