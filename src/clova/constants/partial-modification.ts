import { CommandLabel, CommandSpec, CommandValue } from '../types';

export enum SystemMessage {
  LONG_DESCRIPTION = '문장을 20자 정도 더 길게 작성해줘. 어조와 문체는 유지해줘',
  SHORT_DESCRIPTION = '문장을 간결하게 바꿔줘. 어조와 문체는 유지해줘',
  SUBTITLE = `
  내용에 적합한 소제목을 작성해줘.
  소제목은 "결과를 이끌어낸 행위 + 결과 및 성과"의 형태로 작성해줘.
  독자의 시선을 사로잡을 수 있도록 매력적인 표현을 사용해줘.
  소제목은 한 문장으로 구성하고, 35자가 넘지 않도록 해줘. 소제목만 보내줘.
  예시는 다음과 같아. "끊임없는 도전의 결실, 오류를 해결하고 무중단 배포에 성공하다"
  `,
}

export const Command: Record<CommandValue, CommandSpec> = {
  LONG_DESCRIPTION: { label: '길게 풀어서 작성', length: 20 },
  SHORT_DESCRIPTION: { label: '간결하게 작성', length: 40 },
  SUBTITLE: { label: '소제목 작성', length: 200 },
  SYNONYM: { label: '유의어 대체', length: 1 },
  DIRECT_COMMAND: { label: 'AI에게 직접 명령', length: 0 },
};

interface ModificationOption {
  value: CommandValue;
  label: CommandLabel;
  length: number;
}

export const MODIFICATION_OPTIONS: ModificationOption[] = Object.entries(
  Command,
).map(([key, value]) => ({
  value: key as CommandValue,
  label: value.label as CommandLabel,
  length: value.length,
}));
