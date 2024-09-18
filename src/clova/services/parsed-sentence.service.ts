import { axiosPost } from 'src/common/utils';
import { Injectable } from '@nestjs/common';
import { ClovaChatCompletionsRequestHeaders } from '../constants';
import {
  ChatMessage,
  ChatRole,
  ClovaChatCompletionsResponseBody,
  ClovaRequestHeader,
  ClovaResponse,
} from '../types';
import { ClovaRequestBodyTransformer } from '../utils';

@Injectable()
export class ParsedSentenceService {
  private readonly apiUrl: string =
    process.env.CLOVASTUDIO_API_BASE_URL +
    process.env.CHAT_COMPLETIONS_ENDPOINT;
  private readonly headers: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeaders;

  constructor(
    private readonly clovaRequestBodyTransformer: ClovaRequestBodyTransformer,
  ) {}

  async getParsedSentence(
    text: string,
    length: number,
  ): Promise<ClovaResponse> {
    const { data }: any = await axiosPost(
      this.apiUrl,
      this.clovaRequestBodyTransformer.transformIntoChatCompletions(
        'PARSED_SENTENCE',
        this.makeChatMessages(text, length),
      ),
      this.headers,
    );

    const body: ClovaChatCompletionsResponseBody = data.result;
    return body.message.content;
  }

  private makeChatMessages(text: string, length: number): ChatMessage[] {
    return [
      {
        role: ChatRole.SYSTEM,
        content: `입력을 여러 문장으로 나눠줘. 각 문장이 ${length}자 미만이 되도록 나눠줘. 결과는 나뉜 문장만을 줄글로 보여줘.`,
      },
      {
        role: ChatRole.USER,
        content: text,
      },
    ];
  }
}
