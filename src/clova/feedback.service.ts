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
} from './types';
import { Feedback } from './types/feedback/feedback.type';
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
  ): Promise<Feedback[]> {
    return await this.requestChatCompletions(tone, purpose, text);
  }

  private async requestChatCompletions(
    tone: string,
    purpose: string,
    text: string,
  ): Promise<Feedback[]> {
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

    return ClovaResponseBodyTransformer.transformIntoFeedBackResult(
      res.data.result,
    );
  }

  private makeChatMessages(
    tone: string,
    purpose: string,
    text: string,
  ): ChatMessage[] {
    return [
      {
        role: ChatRole.SYSTEM,
        content: `글의 목적은 ${purpose}고, 어조는 ${tone} 글을 평가하겠습니다.
        정확히 어떠한 부분이 문제인지, 왜 그렇게 평가했는지, 예시를 같이 언급합니다.
        답변은 다음과 같은 형식을 맞춰서 평가하겠습니다.

        - 내용
        내용의 정확한지, 내용 사이의 연관이 있는지, 주제의 명료하고 타당한지, 세부 내용 전개는 적절한지, 중복되는 내용은 없는가, A~F로 나타내고 예시도 언급합니다.

        - 구성
        글 구조의 적절한지, 문단 구조의 적절한지, 구성의 통일성이 있는지, 구성의 일관되어 있는지 A~F로 나타내고 예시도 언급합니다.

        - 표현
        어휘 사용의 적절한지, 문장 구조가 적절한지, 효과적 표현이 사용되었는지, 개성적 표현이 사용되었는지, 지나치게 긴 문장이나 자주 사용되는 단어는 없는지, A~F로 나타내고 예시도 언급합니다.

        - 문법
        주술관계가 잘 이루어져 있는지, 문법적으로 틀린 부분이 없는지, 맞춤법은 적절한지 A~F로 나타내고 예시도 언급합니다.

        - 총평 
        총평 이유와 A~F로 나타냅니다.
        `,
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
