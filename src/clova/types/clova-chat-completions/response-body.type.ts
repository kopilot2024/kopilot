import { ChatMessage } from './chat-message.type';

// https://api.ncloud-docs.com/docs/clovastudio-chatcompletions
export type ClovaChatCompletionsResponseBody = {
  message: ChatMessage;

  stopReason?: any;

  inputLength?: number;
  outputLength?: number;

  seed?: number;

  aiFilter?: any[];
};
