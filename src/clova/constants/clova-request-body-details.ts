import {
  ClovaChatCompletionsRequestBody,
  ClovaCompletionsRequestBody,
} from '../types';

export const SYNONYM_DETAILS: ClovaCompletionsRequestBody = {
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
  topP: 0.6,
  topK: 0,
  maxTokens: 500,
  temperature: 0.1,
  repeatPenalty: 2,
};

export const SHORT_DESCRIPTION_DETAILS: ClovaChatCompletionsRequestBody = {
  messages: [],
  topP: 0.6,
  topK: 0,
  maxTokens: 300,
  temperature: 0.1,
  repeatPenalty: 2,
};

export const SUBTITLE_DETAILS: ClovaChatCompletionsRequestBody = {
  messages: [],
  topP: 0.8,
  topK: 0,
  maxTokens: 100,
  temperature: 0.7,
  repeatPenalty: 2,
};

export const DIRECT_COMMAND_DETAILS: ClovaChatCompletionsRequestBody = {
  messages: [],
  topP: 0.6,
  topK: 0,
  maxTokens: 800,
  temperature: 0.7,
  repeatPenalty: 2,
};
