import { Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeadersForHCX003,
  FEEDBACK_DETAILS,
} from './constants';
import {
  ChatMessage,
  ChatRole,
  ClovaChatCompletionsRequestBody,
  ClovaRequestHeader,
  ClovaResponse,
} from './types';
import { ClovaResponseBodyTransformer, requestPost } from './utils';

@Injectable()
export class FeedbackService {
  private readonly baseApiUrl: string = process.env.CLOVASTUDIO_API_BASE_URL;
  private readonly chatCompletionsEndPoint: string =
    process.env.CHAT_COMPLETIONS_HCX003_ENDPOINT;
  private readonly chatCompletionsHeaders: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeadersForHCX003;

  async getResult(
    tone: string,
    purpose: string,
    text: string,
  ): Promise<ClovaResponse> {
    return await this.requestChatCompletions(tone, purpose, text);
  }

  private async requestChatCompletions(
    tone: string,
    purpose: string,
    text: string,
  ): Promise<ClovaResponse> {
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

    return ClovaResponseBodyTransformer.transformIntoResult(res.data.result);
  }

  private makeChatMessages(
    tone: string,
    purpose: string,
    text: string,
  ): ChatMessage[] {
    return [
      {
        role: ChatRole.SYSTEM,
        content: `글의 목적은 ${purpose}고 어조는 ${tone}인 해당 글에 대해 퍙기해줘
        - 문법적인 평가: 주술관계가 잘 이루어져 있는지, 문법적으로 틀린 부분이 없는지
        - 내용적인 평가: 주제가 일관적인지, 글의 목적에 맞는지`,
      },
      { role: ChatRole.USER, content: text },
    ];
  }

  private makeChatCompletionsData(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...FEEDBACK_DETAILS, messages };
  }
}
