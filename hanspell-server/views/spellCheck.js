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
  var resultDiv = document.getElementById('resultDiv');
  resultDiv.innerHTML = ''; // 기존 결과 초기화

  var content = inputText; // 고친 결과를 저장할 변수
  console.log('error', errors);
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
  resultDiv.innerHTML = '<div><strong>Corrected Text:</strong><br>' + content
      + '</div>';
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

