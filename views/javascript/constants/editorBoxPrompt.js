const PROMPT_GUIDE = `
 - 명확하고 구체적인 명령을 작성해주세요.
   ex. 문장을 간결하게 바꿔줘 (X)
   ex. 문장을 20자 이내로 간결하게 바꿔줘 (O)
 - 단일 작업을 지시해주세요.`;

export const DIRECT_COMMAND_GUIDE = ` AI에게 직접 명령하고 싶은 내용을 입력하세요.
 명령 후 반영 버튼을 클릭하면 선택한 문구가 해당 내용으로 대체됩니다!
${PROMPT_GUIDE}`;
