async function fetchServer(sentence) {
  const URL = 'http://localhost:3000/';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({sentence}),
    });
    return await response.json();
  } catch (error) {
    console.error('Error during spell check:', error);
    throw error;
  }
}

// 결과를 표시하는 함수
function displayResults(errors, inputText) {
  let resultDiv = document.getElementById('resultDiv');
  resultDiv.innerHTML = ''; // 기존 결과 초기화

  let content = inputText; // 고친 결과를 저장할 변수
  // 각 오류에 대해 처리
  errors.forEach(error => {
    const token = error.token;
    const suggestions = error.suggestions.join(', '); // 배열 하나로 합치기
    const info = escapeRegExp(error.info.replace(/\n/g, ' ')); // suggestions에 엔터 제거
    const regex = new RegExp(`(${token})`, 'g');

    // content에서 오류를 강조하고 클릭 이벤트를 추가
    content = content.replace(regex,
        `<span class="highlight-overlay" onclick="showSuggestions(this, '${suggestions}', '${info}')">$1</span>`);
  });

  // 결과를 div에 추가 줄바꿈 유지하기
  resultDiv.innerHTML = content.replace(/\n/g, '<br>');
}

// 클릭 이벤트를 처리할 함수
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
    let resultDiv = document.getElementById('resultDiv');
    let inputText = document.getElementById('inputText');
    inputText.value = resultDiv.innerText; // innerText를 사용하여 텍스트만 가져옵니다.
  });

  // 팝업을 문서에 추가
  document.body.appendChild(popup);
}

async function spellCheck() {
  let inputText = document.getElementById('inputText').value;
  const result = await fetchServer(inputText);
  displayResults(result, inputText);
}

// Event Listener 추가하는 부분, 추후 합칠 때 없어질 부분

// textarea 요소를 가져옵니다.
let inputText = document.getElementById('inputText');

// keydown 이벤트 리스너를 추가합니다.
inputText.addEventListener('keydown', function (event) {
  // Enter 키를 누른 경우 또는 문장 부호 (. ? !)를 입력한 경우에만 처리합니다.
  if (event.key === 'Enter' || event.key === '.' || event.key === '?'
      || event.key === '!') {
    // 입력된 텍스트를 가져옵니다.
    spellCheck()
  }
});