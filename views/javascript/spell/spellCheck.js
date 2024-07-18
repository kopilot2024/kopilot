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
 * resultDiv에 색칠하고 나타내기
 * @param errors
 * @param inputText
 */
async function displayResults(errors, inputText) {
  let content = inputText; // 고친 결과를 저장할 변수
  let index = 0;
  // 각 오류에 대해 처리
  errors.forEach((error) => {
    const token = error.token;
    const context = error.context;
    const suggestions = error.suggestions.join(', '); // 배열 하나로 합치기
    const info = error.info.replace(/\n/g, ' ').replace(/'/g, '`'); // 공백 제거 및 ' 제거

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
  const resultDiv = document.getElementById('output');
  resultDiv.innerHTML = content.replace(/\n/g, '<br>');
}

/**
 * 맞춤법 검사 실행 부분
 */
async function spellCheck(key) {
  const inputText = document.getElementById('textarea').value;
  const result = await fetchServer(inputText);
  if (key === 'Enter') {
    key = '\n';
  }
  await displayResults(result, inputText + key);
  checkLength()
}