import {
  DIRECT_COMMAND_DETAILS,
  LONG_DESCRIPTION_DETAILS,
  REPETITIVE_WORD_DETAIL,
  SHORT_DESCRIPTION_DETAILS,
  SUBTITLE_DETAILS,
  SYNONYM_DETAILS,
} from '../constants';
import {
  ChatMessage,
  ChatRole,
  ClovaChatCompletionsRequestBody,
  ClovaCompletionsRequestBody,
  CommandValue,
} from '../types';

export class ClovaRequestBodyTransformer {
  static transformIntoCompletions(
    command: CommandValue,
    text: string,
  ): ClovaCompletionsRequestBody {
    switch (command) {
      case 'SYNONYM':
        return this.makeSynonym(text);
      default:
        throw new Error('invalid command');
    }
  }

  static transformIntoChatCompletions(
    command: CommandValue,
    chatMessages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    switch (command) {
      case 'LONG_DESCRIPTION':
        return this.makeLongDescription(chatMessages);
      case 'SHORT_DESCRIPTION':
        return this.makeShortDescription(chatMessages);
      case 'SUBTITLE':
        return this.makeSubtitle(chatMessages);
      case 'DIRECT_COMMAND':
        return this.makeDirectCommand(chatMessages);
      default:
        throw new Error('invalid command');
    }
  }

  private static makeSynonym(text: string): ClovaCompletionsRequestBody {
    return { ...SYNONYM_DETAILS, text };
  }

  private static makeLongDescription(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...LONG_DESCRIPTION_DETAILS, messages };
  }

  private static makeShortDescription(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SHORT_DESCRIPTION_DETAILS, messages };
  }

  private static makeSubtitle(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SUBTITLE_DETAILS, messages };
  }

  private static makeDirectCommand(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...DIRECT_COMMAND_DETAILS, messages };
  }

  public static makeRepitiveWordCommand(
    text: string,
  ): ClovaChatCompletionsRequestBody {
    const messages = [
      {
        role: ChatRole.SYSTEM,
        content:
          '- \b입력이 들어왔을 때, 글에서 자주 반복되는 어휘를 찾아서 배열로 반환한다.\n\n\n입력 텍스트 : 하늘이 맑은 날, 나는 하늘을 바라본다. 하늘은 언제나 푸르고 넓다. 하늘을 보면 마음이 평온해진다. 하늘에는 구름이 떠다닌다. 구름은 하늘을 장식하는 아름다운 그림이다. 하늘과 구름은 항상 함께 있다. 구름이 하늘을 가릴 때도 있지만, 하늘은 여전히 그 뒤에 존재한다. 하늘과 구름은 마치 친구처럼 서로를 보듬어준다. 구름이 하늘을 떠다니면, 나는 그 구름 속에서 꿈을 꾼다. 하늘은 나의 꿈을 담아주는 커다란 캔버스다.\n\n\n결과: 하늘, 바람',
      },
      {
        role: ChatRole.USER,
        content: `${text}\n\n\n결과:`,
      },
    ];
    return { ...REPETITIVE_WORD_DETAIL, messages };
  }
}
