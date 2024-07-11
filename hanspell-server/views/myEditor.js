// block api 사용 클래스
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