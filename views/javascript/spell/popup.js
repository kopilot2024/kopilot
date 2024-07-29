import { OutputPopup } from '../components/outputPopup.js';

/**
 * 색칠된 것 클릭 이벤트 추가
 * @param element 어떤 div인지
 * @param suggestions 제안
 * @param info 정보
 */
export function showSuggestion(event, element, suggestion, info) {
  event.stopPropagation(); // 이벤트 전파 막기

  const outputPopup = new OutputPopup(
    `${element.innerText} ➡️ ${suggestion}`,
    `
      <div class="info-container">
        <div class="info-title">정보:</div>
        <div class="info-content">${info.replace(/\.\s*/g, '.\n')}</div>
      </div>
    `,
    () => {
      element.outerHTML = suggestion;
      const output = document.getElementById('output');
      const textarea = document.getElementById('textarea');
      textarea.value = output.innerText;
      outputPopup.hide();
      textarea.focus(); // 커서를 textarea로 이동
    },
  );

  outputPopup.show();
}
