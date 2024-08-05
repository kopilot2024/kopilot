import * as dotenv from 'dotenv';
import { ClovaRequestHeader } from '../types';

dotenv.config();

const ClovaRequestHeaders: ClovaRequestHeader = {
  'X-NCP-CLOVASTUDIO-API-KEY': process.env.X_NCP_CLOVASTUDIO_API_KEY,
  'X-NCP-APIGW-API-KEY': process.env.X_NCP_APIGW_API_KEY,
  'X-NCP-CLOVASTUDIO-REQUEST-ID': '',
  'Content-Type': 'application/json',
};

export const ClovaCompletionsRequestHeaders: ClovaRequestHeader = {
  ...ClovaRequestHeaders,
  'X-NCP-CLOVASTUDIO-REQUEST-ID':
    process.env.X_NCP_CLOVASTUDIO_REQUEST_ID_FOR_COMPLETIONS,
};

export const ClovaChatCompletionsRequestHeaders: ClovaRequestHeader = {
  ...ClovaRequestHeaders,
  'X-NCP-CLOVASTUDIO-REQUEST-ID':
    process.env.X_NCP_CLOVASTUDIO_REQUEST_ID_FOR_CHAT_COMPLETIONS,
};

export const ClovaChatCompletionsRequestHeadersForHCX003: ClovaRequestHeader = {
  ...ClovaRequestHeaders,
  'X-NCP-CLOVASTUDIO-REQUEST-ID':
    process.env.X_NCP_CLOVASTUDIO_REQUEST_ID_FOR_CHAT_COMPLETIONS_HCX003,
};

export const ClovaChatCompletionsRequestHeadersForRepetitiveWord: ClovaRequestHeader =
  {
    ...ClovaRequestHeaders,
    'X-NCP-CLOVASTUDIO-REQUEST-ID':
      process.env.X_NCP_CLOVASTUDIO_REQUEST_ID_FOR_REPETITIVE_WORD,
  };
