import { Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeadersForHCX003,
  ClovaCompletionsRequestHeaders,
  CommandValue,
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
    command: string,
  ): Promise<ClovaCompletionsResponseBody | PartialModificationResult> {
    return command === CommandValue.SYNONYM
      ? await this.requestCompletions(input)
      : await this.requestChatCompletions(input, command);
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
    CommandValue: string,
  ): Promise<PartialModificationResult> {
    const chatMessages: ChatMessage[] = this.makeChatMessages(
      input,
      CommandValue,
    );
    const res: any = await requestPost(
      `${this.baseApiUrl}${this.chatCompletionsEndPoint}`,
      this.makeChatCompletionsData(CommandValue, chatMessages),
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
    command: string,
    chatMessages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    switch (command) {
      case CommandValue.LONG_DESCRIPTION:
        return this.makeLongDescriptionData(chatMessages);
      case CommandValue.SHORT_DESCRIPTION:
        return this.makeShortDescriptionData(chatMessages);
      case CommandValue.SUBTITLE:
        return this.makeSubtitleData(chatMessages);
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

  private makeChatMessages(
    selectedText: string,
    selectedButton: string,
  ): ChatMessage[] {
    return [
      { role: ChatRole.USER, content: selectedText },
      { role: ChatRole.SYSTEM, content: SystemMessage[selectedButton] },
    ];
  }
}
