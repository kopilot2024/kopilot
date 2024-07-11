/**
 * 특수문자 처리
 * @param string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $&는 매치된 전체 문자열을 의미합니다.
}

/**
 * span 제거 함수
 * @param content
 */
function removeSpan(content) {
  return content.replace(/<span[^>]*>|<\/span>/g, '');
}

/**
 * 문장부호 . ? !
 * @type {string[]}
 */
const marks = ['.', '?', '!'];