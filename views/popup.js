/**
 * 색칠된 것 클릭 이벤트 추가
 * @param element 어떤 div인지
 * @param suggestions 제안
 * @param info 정보
 */
function showSuggestions(element, suggestions, info) {
  // 팝업 요소 생성
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div>Suggestions: ${suggestions}</div>
    <div>Info: ${info}</div>
    <div class="apply-btn">반영하기</div>
    <div class="close-btn">닫기</div>
  `;

  // 팝업 닫기 버튼 클릭 이벤트 추가
  popup.querySelector('.close-btn').addEventListener('click', function () {
    document.body.removeChild(popup);
  });

  // 팝업 반영하기 버튼 클릭 이벤트 추가
  popup.querySelector('.apply-btn').addEventListener('click', function () {
    element.outerHTML = suggestions;
    document.body.removeChild(popup);
    // resultDiv의 텍스트를 inputText에 반영
    const resultDiv = document.getElementById('resultDiv');
    const inputText = document.getElementById('inputText');
    inputText.value = resultDiv.innerText; // innerText를 사용하여 텍스트만 가져옵니다.
  });

  // 팝업을 문서에 추가
  document.body.appendChild(popup);
}
