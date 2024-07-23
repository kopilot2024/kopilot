import { showSuggestion } from './popup.js'
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
 * output에 색칠하고 나타내기
 * @param errors
 * @param inputText
 */
function setHighlightEvent(errors, inputText) {
  if (!errors) {
    return ;
  }

  let content = inputText;
  let index = 0;
  const output = document.getElementById('output');
  output.innerHTML = ''; // 기존 내용 초기화

  errors.forEach((error) => {
    const token = error.token;
    const context = error.context;
    const suggestions = error.suggestions.join(', ');
    const info = error.info.replace(/\n/g, ' ').replace(/'/g, '`');

    index = content.indexOf(context, index);
    if (index !== -1) {
      const tokenIndex = content.indexOf(token, index);
      if (tokenIndex !== -1 && tokenIndex < index + context.length) {
        content =
          content.substring(0, tokenIndex) +
          `<span class="highlight red" data-suggestions="${suggestions}" data-info="${info}">${token}</span>` +
          content.substring(tokenIndex + token.length);

        index += `<span class="highlight red">${token}</span>`.length;
      }
    }
  });

  // 줄바꿈 유지하여 결과를 div에 추가
  output.innerHTML = content.replace(/\n/g, '<br>');
  setEvent();
  
}

/**
 * 모든 highlight.red 요소에 이벤트 리스너 추가
 */
function setEvent(){
  document.querySelectorAll('.highlight.red').forEach((element) => {
    element.addEventListener('click', function (event) {
      showSuggestion(
        event,
        element,
        element.getAttribute('data-suggestions'),
        element.getAttribute('data-info'),
      );
    });
  });
}

let debounceTimer;

// 디바운싱 함수
function debounce(fn, delay) {
  return function(...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * 맞춤법 검사 실행 부분 디바운싱 도입
 */
export const spellCheck = debounce(async () => {
  checkLength();
  const inputText = document.getElementById('output').innerHTML;
  const result = await fetchServer(inputText.replace(/<\/?span[^>]*>/gi, ''));
  setHighlightEvent(result, inputText);
  setEvent();
}, 200);