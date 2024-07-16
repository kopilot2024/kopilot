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
// 결과를 표시하는 함수
async function displayResults(errors, inputText) {
  let resultDiv = document.getElementById('resultDiv');
  resultDiv.innerHTML = ''; // 기존 결과 초기화

  let content = inputText; // 고친 결과를 저장할 변수
  let index = 0;
  // 각 오류에 대해 처리
  errors.forEach((error) => {
    const token = error.token;
    const context = error.context;
    const suggestions = error.suggestions.join(', '); // 배열 하나로 합치기
    const info = error.info.replace(/\n/g, ' ').replace(/'/g, '`'); // suggestions에 엔터 제거

    index = content.indexOf(context, index);
    if (index !== -1) {
      const tokenIndex = content.indexOf(token, index);
      if (tokenIndex !== -1 && tokenIndex < index + context.length) {
        // token을 하이라이트로 감싸기
        hightlight = `<span class="highlight-overlay" onclick="showSuggestions(this, '${suggestions}', '${info}')">${token}</span>`;
        content =
          content.substring(0, tokenIndex) +
          hightlight +
          content.substring(tokenIndex + token.length);

        // 다음 인덱스부터 검사 시작
        index += hightlight.length;
      } else {
        // 다음 context 검색
        index += context.length;
      }
    }
  });

  // 결과를 div에 추가 <br>로 줄바꿈 유지하기
  resultDiv.innerHTML = content.replace(/\n/g, '<br>');
}

/**
 * 맞춤법 검사, 마지막 입력이 안되는 부분 수정
 * 맞춤법 검사를 보낼 때, 문장을 엔터로 나눠서 검사하기
 */
async function spellCheck(key) {
  const inputText = document.getElementById('inputText').value;
  const result = await fetchServer(inputText.replace(/[.?!]/g, '\n'));
  if (key == 'Enter') {
    key = '\n';
  }
  displayResults(result, inputText + key);
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
    spellCheck(event.key);
  }
});
