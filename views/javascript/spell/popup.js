/**
 * 색칠된 것 클릭 이벤트 추가
 * @param element 어떤 div인지
 * @param suggestions 제안
 * @param info 정보
 */
function showSuggestions(event, element, suggestions, info) {
  event.stopPropagation(); // 이벤트 전파 막기

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="text-container">
      <span class="original">${element.innerText}</span>
      <span class="arrow">➡️</span>
      <span class="suggestion">${suggestions}</span>
    </div>
    <div class="info-container">
      <div class="info-title">정보:</div>
      <div class="info-content">${info.replace(/\.\s*/g, '.\n')}</div>
    </div>
    <div class="btn-container">
      <div class="btn apply-btn">반영하기</div>
      <div class="btn close-btn">닫기</div>
    </div>
  `;

  popup.querySelector('.close-btn').addEventListener('click', function () {
    document.body.removeChild(popup);
  });

  popup.querySelector('.apply-btn').addEventListener('click', function () {
    element.outerHTML = suggestions;
    document.body.removeChild(popup);

    const output = document.getElementById('output');
    const textarea = document.getElementById('textarea');
    textarea.value = output.innerText;
  });

  document.body.appendChild(popup);
  popup.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}