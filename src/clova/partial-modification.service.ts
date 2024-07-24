import { Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeaders,
  ClovaCompletionsRequestHeaders,
} from './constants/cloav-request-headers-details';
import {
  LONG_DESCRIPTION_DETAILS,
  SHORT_DESCRIPTION_DETAILS,
  SYNONYM_DATA_DETAILS,
} from './constants/clova-request-body-details';
import { Command, SystemMessage } from './constants/partial-modification';
import {
  ChatMessage,
  ChatRole,
} from './type/clova-chat-completions/chat-message.type';
import { ClovaChatCompletionsRequestBody } from './type/clova-chat-completions/request-body.type';
import { ClovaChatCompletionsResponseBody } from './type/clova-chat-completions/response-body.type';
import { ClovaCompletionsRequestBody } from './type/clova-completions/request-body.type';
import { ClovaCompletionsResponseBody } from './type/clova-completions/response-body.type';
import { ClovaRequestHeader } from './type/clova-request-header.type';
import { PartialModificationResult } from './type/partial-response.type';
import { requestPost } from './utils/request-api';

@Injectable()
export class PartialModificationService {
  private readonly baseApiUrl: string = process.env.CLOVASTUDIO_API_BASE_URL;
  private readonly completionsEndPoint: string =
    process.env.COMPLETIONS_ENDPOINT;
  private readonly chatCompletionsEndPoint: string =
    process.env.CHAT_COMPLETIONS_ENDPOINT;
  private readonly completionsHeaders: ClovaRequestHeader =
    ClovaCompletionsRequestHeaders;
  private readonly chatCompletionsHeaders: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeaders;

  async getResult(
    input: string,
    command: string,
  ): Promise<ClovaCompletionsResponseBody | PartialModificationResult> {
    return command === Command.SYNONYM
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
    command: string,
  ): Promise<PartialModificationResult> {
    const chatMessages: ChatMessage[] = this.makeChatMessages(input, command);
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
    command: string,
    chatMessages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    switch (command) {
      case Command.LONG_DESCRIPTION:
        return this.makeLongDescriptionData(chatMessages);
      case Command.SHORT_DESCRIPTION:
        return this.makeShortDescriptionData(chatMessages);
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
