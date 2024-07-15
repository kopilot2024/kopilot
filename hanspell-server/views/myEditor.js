﻿// block api 사용 클래스
class MyTool {
  constructor({api}) {
    this.api = api;
  }

  // 렌더링된 블록의 개수를 가져오는 메서드
  getBlocksCount() {
    return this.api.blocks.getBlocksCount();
  }

  // 현재 포커스된 블록의 인덱스를 가져오는 메서드
  getCurrentBlockIndex() {
    return this.api.blocks.getCurrentBlockIndex();
  }

  // 블럭을 인덱스로 가져오기
  getBlockByIndex(index) {
    return this.api.blocks.getBlockByIndex(index);
  }
}

/**
 * api 사용 인스턴스
 */
let myToolInstance;

// EditorJS 초기화 및 MyTool 등록
const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    myTool: {
      class: MyTool,
    },
  },
  onReady: () => {
    myToolInstance = new MyTool({api: editor});
    addGlobalEventListeners()
  },
  onChange: () => {
    //TODO: 블럭 삭제 시 index 초기화 잘 해야함.
  },
});

let previousBlockIndex = 0; // 이전 입력 텍스트 저장 변수

// TODO: 에디터 위에서만 동작하도록 수정하기
// 시작시 등록하는 EventListeners
function addGlobalEventListeners() {
  document.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('click', handleGlobalClick);
}

/**
 * 주어진 id 블럭 내에서 커서 위치를 계산 (태그 제외)
 * @param id
 * @return {number} 커서의 전체 텍스트 내 위치
 */
function getCursorPositionInBlock(id) {
  const element = document.querySelector(
      `.ce-block[data-id="${id}"] .ce-block__content .ce-paragraph.cdx-block`);
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  let cursorPosition = 0;
  let found = false;

  function calculatePosition(node) {
    if (found) {
      return;
    }

    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child === range.startContainer) {
          cursorPosition += range.startOffset;
          found = true;
          return;
        } else {
          cursorPosition += child.textContent.length;
        }
      } else {
        calculatePosition(child);
      }

      if (found) {
        return;
      }
    }
  }

  calculatePosition(element);
  return cursorPosition;
}

// TODO: 블럭의 수가 줄어들었을 때 previous 오류 수정하기
// keydown 이벤트 검사하기
function handleGlobalKeydown(event) {
  const blockIndex = myToolInstance.getCurrentBlockIndex();
  const cursorPosition = getCursorPositionInBlock(
      myToolInstance.getBlockByIndex(blockIndex).id);
  console.log(`Block index: ${blockIndex}, Cursor position: ${cursorPosition}`);
  // 엔터쳐서 position이 0이면, 다음 줄 넘긴건지 확인
  if (blockIndex !== -1 && previousBlockIndex !== blockIndex) {
    isEndWithEnter();
  } else {
    // 아니면 문장부호? 문장의 끝을 감지하여 메시지를 출력하는 로직 추가
    isEndWithMarks(event, blockIndex, cursorPosition);
  }
  previousBlockIndex = blockIndex;
}

/**
 * 커서를 블럭의 특정 위치로 이동
 * @param id
 * @param cursorPosition
 */
function moveCursorToPosition(id, cursorPosition) {
  const element = document.querySelector(
      `.ce-block[data-id="${id}"] .ce-block__content .ce-paragraph.cdx-block`);

  const range = document.createRange();
  const selection = window.getSelection();

  let currentPos = 0;
  let found = false;

  function setCursor(node, remainingPos) {
    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (currentPos + child.textContent.length >= remainingPos) {
          range.setStart(child, remainingPos - currentPos);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          found = true;
          return;
        } else {
          currentPos += child.textContent.length;
        }
      } else {
        setCursor(child, remainingPos);
        if (found) {
          return;
        }
      }
    }
  }

  setCursor(element, cursorPosition);
}

// 문장 부호로 끝났다면 맞춤법 요청, 색칠, 커서 옮기기
async function isEndWithMarks(event, blockIndex, cursorPosition) {
  if (marks.includes(event.key)) {
    const currentText = event.target.innerText;
    // TODO: 전체 블럭 문장들이 아니라, 특정 문장으로만 해야할까?
    // 맞춤법 요청, 색칠,
    const result = await spellCheck(currentText + event.key);
    const block = myToolInstance.getBlockByIndex(blockIndex);
    await highlightErrors(block, result);
    // 문장부호는 + 1 해서 다음으로
    moveCursorToPosition(block.id, cursorPosition + 1);
  }
}

// 엔터로 줄바꿈했다면, 이전 블럭 검사 후 색칠
async function isEndWithEnter() {
  const previousBlock = myToolInstance.getBlockByIndex(previousBlockIndex);
  const result = await spellCheck(previousBlock.holder.innerText);
  await highlightErrors(previousBlock, result);
}

// 클릭으로 이동했을 때 TODO: 클릭으로 이동시 인덱스 수정
async function handleGlobalClick(event) {
  const currentBlockIndex = myToolInstance.getCurrentBlockIndex();
  if (currentBlockIndex !== -1 && previousBlockIndex !== currentBlockIndex) {
    console.log('block changed', currentBlockIndex, '->', previousBlockIndex);
    const previousBlock = myToolInstance.getBlockByIndex(previousBlockIndex);
    const result = await spellCheck(previousBlock.holder.innerText);
    await highlightErrors(previousBlock, result);
  }
  previousBlockIndex = currentBlockIndex;
}

// 결과 창 알림 TODO: 추후 팝업으로 보여주기
function showSuggestions(suggestions, info) {
  alert('Suggestions: ' + suggestions + '\nInfo: ' + info);
}

// 맞춤법 검사 결과로 block 색칠하기
async function highlightErrors(block, errors) {
  // 현재 블록의 텍스트에서 <span> 태그 제거
  let content = block.holder.innerText;
  console.log('before', content);
  content = removeSpan(content);
  errors.forEach(error => {
    const token = error.token;
    const escapedToken = escapeRegExp(token); // 토큰 이스케이프 처리
    const suggestions = escapeRegExp(error.suggestions.join(', ')); // 배열 하나로 합치기
    const info = escapeRegExp(error.info.replace(/\n/g, ' ')); // suggestions에 엔터 제거
    // TODO: 정규식으로 대체가 아니라 앞에서부터 토큰 검사해서 맞는거 치기
    const regex = new RegExp(`(${escapedToken})`, 'g');
    content = content.replace(regex,
        `<span class="highlight-overlay" onclick="showSuggestions('${suggestions}', '${info}')">$1</span>`);
  });

  await editor.blocks.update(block.id, {
    text: content,
  });
}