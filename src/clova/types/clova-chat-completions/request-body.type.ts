import { ChatMessage } from './chat-message.type';

// https://api.ncloud-docs.com/docs/clovastudio-chatcompletions
export type ClovaChatCompletionsRequestBody = {
  messages: ChatMessage[];

  temperature?: number;

  topK?: number;
  topP?: number;

  repeatPenalty?: number;

  stopBefore?: string;

  maxTokens?: number;

  includeAiFilters?: boolean;

  seed?: number;
};
