/**
 * node 서버로 맞춤법 요청
 * @param sentence
 * @returns {Promise<any>}
 */
async function fetchServer(sentence) {
  const URL = 'http://localhost:3000/spell';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ sentence }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error during spell check:', error);
    throw error;
  }
}

/**
 * 특수문자 처리
 * @param string
 */
function escapeRegExp(string) {
  return string.replace(/[*+?^${}|[\]\\']/g, ''); // $&는 매치된 전체 문자열을 의미합니다.
}

/**
 * resultDiv에 색칠하고 나타내기
 * @param errors
 * @param inputText
 */
function displayResults(errors, inputText) {
  const resultDiv = document.getElementById('resultDiv');
  resultDiv.innerHTML = ''; // 기존 결과 초기화

  let content = inputText; // 고친 결과를 저장할 변수
  // 각 오류에 대해 처리
  errors.forEach((error) => {
    const token = error.token;
    const suggestions = error.suggestions.join(', '); // 배열 하나로 합치기
    const info = escapeRegExp(error.info.replace(/\n/g, ' ')); // suggestions에 엔터 제거
    const regex = new RegExp(`(${token})`, 'g');

    // content에서 오류를 강조하고 클릭 이벤트를 추가
    content = content.replace(
      regex,
      `<span class="highlight-overlay" onclick="showSuggestions(this, '${suggestions}', '${info}')">$1</span>`,
    );
  });

  // 결과를 div에 추가 <br>로 줄바꿈 유지하기
  resultDiv.innerHTML = content.replace(/\n/g, '<br>');
}

/**
 * 맞춤법 검사
 */
async function spellCheck() {
  const inputText = document.getElementById('inputText').value;
  const result = await fetchServer(inputText);
  displayResults(result, inputText);
}

// Event Listener 추가하는 부분, 추후 합칠 때 없어질 부분

// textarea 요소를 가져옵니다.
const inputTextDiv = document.getElementById('inputText');

// keydown 이벤트 리스너를 추가합니다.
inputTextDiv.addEventListener('keydown', function (event) {
  // Enter 키를 누른 경우 또는 문장 부호 (. ? !)를 입력한 경우에만 처리합니다.
  if (
    event.key === 'Enter' ||
    event.key === '.' ||
    event.key === '?' ||
    event.key === '!'
  ) {
    spellCheck();
  }
});
