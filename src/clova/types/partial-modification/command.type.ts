export type CommandValue =
  | 'LONG_DESCRIPTION'
  | 'SHORT_DESCRIPTION'
  | 'SUBTITLE'
  | 'SYNONYM'
  | 'DIRECT_COMMAND';

export type CommandLabel =
  | '길게 풀어서 작성'
  | '간결하게 작성'
  | '소제목 작성'
  | '유의어 대체'
  | 'AI에게 직접 명령';

export type CommandPosition = 'BEFORE' | 'AFTER' | 'DEFAULT';

export type CommandSpec = {
  label: CommandLabel;
  position: CommandPosition;
  length: number;
};
