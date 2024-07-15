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
        `<span class="highlight-overlay" onclick="showSuggestions('${suggestions}', '${info}')">$1</span>`);
  });

  // 결과를 div에 추가
  resultDiv.innerHTML = content;
}

// 클릭 이벤트를 처리할 함수
function showSuggestions(suggestions, info) {
  alert('Suggestions: ' + suggestions + '\nInfo: ' + info);
}

async function spellCheck() {
  let inputText = document.getElementById('inputText').value;
  const result = await fetchServer(inputText);
  displayResults(result, inputText);
}

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