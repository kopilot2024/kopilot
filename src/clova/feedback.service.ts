import { Injectable } from '@nestjs/common';
import { ClovaChatCompletionsRequestHeaders } from './constants/cloav-request-headers-details';
import { LONG_DESCRIPTION_DETAILS } from './constants/clova-request-body-details';
import {
  ChatMessage,
  ChatRole,
  ClovaChatCompletionsRequestBody,
  ClovaChatCompletionsResponseBody,
  ClovaCompletionsResponseBody,
  ClovaRequestHeader,
  PartialModificationResult,
} from './types';
import { requestPost } from './utils/request-api';

@Injectable()
export class FeedbackService {
  private readonly baseApiUrl: string = process.env.CLOVASTUDIO_API_BASE_URL;
  private readonly chatCompletionsEndPoint: string =
    process.env.CHAT_COMPLETIONS_ENDPOINT;
  private readonly chatCompletionsHeaders: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeaders;

  async getResult(
    tone: string,
    purpose: string,
    text: string,
  ): Promise<ClovaCompletionsResponseBody | PartialModificationResult> {
    return await this.requestChatCompletions(tone, purpose, text);
  }

  private async requestChatCompletions(
    tone: string,
    purpose: string,
    text: string,
  ): Promise<PartialModificationResult> {
    const chatMessages: ChatMessage[] = this.makeChatMessages(
      tone,
      purpose,
      text,
    );
    const res: any = await requestPost(
      `${this.baseApiUrl}${this.chatCompletionsEndPoint}`,
      this.makeChatCompletionsData(chatMessages),
      this.chatCompletionsHeaders,
    );
    const body: ClovaChatCompletionsResponseBody = res.data.result;
    return { result: body.message.content };
  }

  private makeChatMessages(
    tone: string,
    purpose: string,
    text: string,
  ): ChatMessage[] {
    return [
      {
        role: ChatRole.SYSTEM,
        content: `${purpose}고 ${tone}인 해당 글에 대해 평가만 제공해줘\r\n평가 기준은 명확성, 논리적 흐름, 어조와 스타일로 평가와 그 이유도 함께 알려줘\r\n\n`,
      },
      { role: ChatRole.USER, content: text },
    ];
  }

  private makeChatCompletionsData(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...LONG_DESCRIPTION_DETAILS, messages };
  }
}
