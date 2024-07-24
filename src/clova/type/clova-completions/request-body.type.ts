// https://api.ncloud-docs.com/docs/clovastudio-completions
export type ClovaCompletionsRequestBody = {
  text: string;

  topK?: number;
  topP?: number;

  repeatPenalty?: number;
  stopBefore?: string[];

  start?: string;
  restart?: string;

  maxTokens?: number;
  includeTokens?: boolean;

  temperature?: number;
  includeAiFilters?: boolean;
};
