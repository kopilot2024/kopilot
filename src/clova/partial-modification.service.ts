import { Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeadersForHCX003,
  ClovaCompletionsRequestHeaders,
  DIRECT_COMMAND_DETAILS,
  LONG_DESCRIPTION_DETAILS,
  SHORT_DESCRIPTION_DETAILS,
  SUBTITLE_DETAILS,
  SYNONYM_DATA_DETAILS,
  SystemMessage,
} from './constants';
import {
  ChatMessage,
  ChatRole,
  ClovaChatCompletionsRequestBody,
  ClovaChatCompletionsResponseBody,
  ClovaCompletionsRequestBody,
  ClovaCompletionsResponseBody,
  ClovaRequestHeader,
  CommandValue,
  PartialModificationResult,
} from './types';
import { requestPost } from './utils/request-api';

@Injectable()
export class PartialModificationService {
  private readonly baseApiUrl: string = process.env.CLOVASTUDIO_API_BASE_URL;
  private readonly completionsEndPoint: string =
    process.env.COMPLETIONS_ENDPOINT;
  private readonly chatCompletionsEndPoint: string =
    process.env.CHAT_COMPLETIONS_HCX003_ENDPOINT;
  private readonly completionsHeaders: ClovaRequestHeader =
    ClovaCompletionsRequestHeaders;
  private readonly chatCompletionsHeaders: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeadersForHCX003;

  async getResult(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): Promise<ClovaCompletionsResponseBody | PartialModificationResult> {
    return command === 'SYNONYM'
      ? await this.requestCompletions(input)
      : await this.requestChatCompletions(input, command, systemMessage);
  }

  private async requestCompletions(
    text: string,
  ): Promise<ClovaCompletionsResponseBody> {
    const res: any = await requestPost(
      `${this.baseApiUrl}${this.completionsEndPoint}`,
      this.makeSynonymData(text),
      this.completionsHeaders,
    );
    console.log(res.data);
    return res.data; // TODO 데이터 전처리
  }

  private async requestChatCompletions(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): Promise<PartialModificationResult> {
    const chatMessages: ChatMessage[] =
      command === 'DIRECT_COMMAND'
        ? this.makeChatMessagesForDirectCommand(input, systemMessage)
        : this.makeChatMessages(input, command);

    const res: any = await requestPost(
      `${this.baseApiUrl}${this.chatCompletionsEndPoint}`,
      this.makeChatCompletionsData(command, chatMessages),
      this.chatCompletionsHeaders,
    );

    const body: ClovaChatCompletionsResponseBody = res.data.result;
    return { result: body.message.content };
  }

  private makeSynonymData(text: string): ClovaCompletionsRequestBody {
    if (!text) {
      throw new Error('invalid input');
    }
    return { ...SYNONYM_DATA_DETAILS, text };
  }

  private makeChatCompletionsData(
    command: CommandValue,
    chatMessages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    switch (command) {
      case 'LONG_DESCRIPTION':
        return this.makeLongDescriptionData(chatMessages);
      case 'SHORT_DESCRIPTION':
        return this.makeShortDescriptionData(chatMessages);
      case 'SUBTITLE':
        return this.makeSubtitleData(chatMessages);
      case 'DIRECT_COMMAND':
        return this.makeDirectCommandData(chatMessages);
      default:
        throw new Error('invalid input');
    }
  }

  private makeLongDescriptionData(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...LONG_DESCRIPTION_DETAILS, messages };
  }

  private makeShortDescriptionData(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SHORT_DESCRIPTION_DETAILS, messages };
  }

  private makeSubtitleData(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SUBTITLE_DETAILS, messages };
  }

  private makeDirectCommandData(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...DIRECT_COMMAND_DETAILS, messages };
  }

  private makeChatMessages(
    selectedText: string,
    selectedButton: string,
  ): ChatMessage[] {
    return [
      { role: ChatRole.USER, content: selectedText },
      { role: ChatRole.SYSTEM, content: SystemMessage[selectedButton] },
    ];
  }

  private makeChatMessagesForDirectCommand(
    selectedText: string,
    systemMessage: string,
  ): ChatMessage[] {
    return [
      { role: ChatRole.USER, content: selectedText },
      { role: ChatRole.SYSTEM, content: systemMessage },
    ];
  }
}
