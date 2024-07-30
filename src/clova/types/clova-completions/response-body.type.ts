// https://api.ncloud-docs.com/docs/clovastudio-completions
export type ClovaCompletionsResponseBody = {
  text?: string;

  stopReason?: string;

  inputLength?: number;
  inputTokens?: string[];

  outputLength?: number;
  outputTokens?: string[];

  probs?: number;

  aiFilter?: any[];
};
