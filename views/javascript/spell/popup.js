import { OutputPopup } from '../components/outputPopup.js';
import { spellCheck } from './spellCheck.js';

/**
 * 색칠된 것 클릭 이벤트 추가
 * @param element 어떤 div인지
 * @param suggestions 제안
 * @param info 정보
 */
export function showSuggestion(event, element, idx) {
  event.stopPropagation(); // 이벤트 전파 막기

  const outputPopup = new OutputPopup(
    `교정된 결과가 맞는지 확인해주세요.<br>직접 수정할 수 있어요!`,
    `
      <div class="suggestion-edit-container">
        <div class="suggestion-edit-instructions">${element.innerText}</div>
        <input type="text" id="suggestion-edit" class="suggestion-edit" value="${element.getAttribute('data-suggestions')}">
      </div>
    `,
    () => {
      const editedSuggestion = document.getElementById('suggestion-edit').value;
      element.outerHTML = editedSuggestion;
      const output = document.getElementById('output');
      const textarea = document.getElementById('textarea');
      textarea.value = output.innerText;
      spellCheck.removeErrorByIndex(idx);
      outputPopup.hide();
      textarea.focus(); // 커서를 textarea로 이동
    },
  );

  outputPopup.show();
}
