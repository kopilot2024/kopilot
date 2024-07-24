import { ClovaChatCompletionsRequestBody } from '../type/clova-chat-completions/request-body.type';
import { ClovaCompletionsRequestBody } from '../type/clova-completions/request-body.type';

export const SYNONYM_DATA_DETAILS: ClovaCompletionsRequestBody = {
  text: '',
  start: '의 한국어 유의어 목록은 다음과 같습니다. 1.',
  restart: '',
  includeTokens: true,
  topP: 0.8,
  topK: 0,
  maxTokens: 100,
  temperature: 0.5,
  repeatPenalty: 5.0,
  stopBefore: ['6'],
  includeAiFilters: true,
};

export const LONG_DESCRIPTION_DETAILS: ClovaChatCompletionsRequestBody = {
  messages: [],
  topP: 0.4,
  topK: 0,
  maxTokens: 300,
  temperature: 0.1,
  repeatPenalty: 2,
};

export const SHORT_DESCRIPTION_DETAILS: ClovaChatCompletionsRequestBody = {
  messages: [],
  topP: 0.4,
  topK: 0,
  maxTokens: 300,
  temperature: 0.1,
  repeatPenalty: 2,
};
