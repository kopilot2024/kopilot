import { Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeadersForHCX003,
  ClovaCompletionsRequestHeaders,
  SystemMessage,
} from './constants';
import {
  ChatMessage,
  ChatRole,
  ClovaChatCompletionsResponseBody,
  ClovaCompletionsResponseBody,
  ClovaRequestHeader,
  CommandValue,
  ResultResponse,
} from './types';
import { requestPost } from './utils/request-api';
import { ClovaRequestBodyTransformer } from './utils/request-body.transformer';

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
  ): Promise<ClovaCompletionsResponseBody | ResultResponse> {
    return command === 'SYNONYM'
      ? await this.requestCompletions(command, input)
      : await this.requestChatCompletions(input, command, systemMessage);
  }

  private async requestCompletions(
    command: CommandValue,
    text: string,
  ): Promise<ClovaCompletionsResponseBody> {
    const res: any = await requestPost(
      `${this.baseApiUrl}${this.completionsEndPoint}`,
      ClovaRequestBodyTransformer.transformIntoCompletions(command, text),
      this.completionsHeaders,
    );
    console.log(res.data);
    return res.data; // TODO 데이터 전처리
  }

  private async requestChatCompletions(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): Promise<ResultResponse> {
    const chatMessages: ChatMessage[] =
      command === 'DIRECT_COMMAND'
        ? this.makeChatMessagesForDirectCommand(input, systemMessage)
        : this.makeChatMessages(input, command);

    const res: any = await requestPost(
      `${this.baseApiUrl}${this.chatCompletionsEndPoint}`,
      ClovaRequestBodyTransformer.transformIntoChatCompletions(
        command,
        chatMessages,
      ),
      this.chatCompletionsHeaders,
    );

    const body: ClovaChatCompletionsResponseBody = res.data.result;
    return { result: body.message.content };
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
