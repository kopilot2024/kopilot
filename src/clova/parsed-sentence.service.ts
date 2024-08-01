import { Injectable } from '@nestjs/common';
import { ClovaChatCompletionsRequestHeaders } from './constants';
import {
  ChatRole,
  ClovaChatCompletionsResponseBody,
  ClovaRequestHeader,
} from './types';
import { requestPost } from './utils';

@Injectable()
export class ParsedSentenceService {
  private readonly apiUrl: string =
    process.env.CLOVASTUDIO_API_BASE_URL +
    process.env.CHAT_COMPLETIONS_ENDPOINT;
  private readonly headers: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeaders;

  async getParsedSentence(text: string, length: number): Promise<string> {
    const data = {
      messages: [
        {
          role: ChatRole.SYSTEM,
          content: `문장이 ${length}자가 넘는다면, 한 문장을 ${length}자 미만으로 나눠줘. 결과는 나뉜 문장만을 줄글로 보여줘.`,
        },
        {
          role: ChatRole.USER,
          content: text,
        },
      ],
      topP: 0.8,
      topK: 0,
      maxTokens: 256,
      temperature: 0.8,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
      seed: 0,
    };

    const res: any = await requestPost(this.apiUrl, data, this.headers);

    const body: ClovaChatCompletionsResponseBody = res.data.result;
    return body.message.content;
  }
}
