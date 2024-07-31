import { Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeadersForHCX003,
  ClovaCompletionsRequestHeaders,
  SystemMessage,
} from './constants';
import {
  ChatMessage,
  ChatRole,
  ClovaRequestHeader,
  ClovaResponse,
  CommandValue,
} from './types';
import {
  ClovaRequestBodyTransformer,
  ClovaResponseBodyTransformer,
  requestPost,
} from './utils';

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
  ): Promise<ClovaResponse> {
    return command === 'SYNONYM'
      ? await this.requestCompletions(command, input)
      : await this.requestChatCompletions(input, command, systemMessage);
  }

  private async requestCompletions(
    command: CommandValue,
    text: string,
  ): Promise<ClovaResponse> {
    const res: any = await requestPost(
      `${this.baseApiUrl}${this.completionsEndPoint}`,
      ClovaRequestBodyTransformer.transformIntoCompletions(command, text),
      this.completionsHeaders,
    );

    return ClovaResponseBodyTransformer.transformIntoSynonymResult(
      res.data.result,
    );
  }

  private async requestChatCompletions(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): Promise<ClovaResponse> {
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

    return ClovaResponseBodyTransformer.transformIntoResult(res.data.result);
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
