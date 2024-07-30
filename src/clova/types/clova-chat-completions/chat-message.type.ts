export enum ChatRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type ChatMessage = {
  role: ChatRole;
  content: string;
};
