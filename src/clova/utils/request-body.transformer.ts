import {
  DIRECT_COMMAND_DETAILS,
  LONG_DESCRIPTION_DETAILS,
  SHORT_DESCRIPTION_DETAILS,
  SUBTITLE_DETAILS,
  SYNONYM_DETAILS,
} from '../constants';
import {
  ChatMessage,
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
}
