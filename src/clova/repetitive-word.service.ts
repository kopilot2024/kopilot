import { Injectable } from '@nestjs/common';
import { ClovaChatCompletionsRequestHeadersForRepetitiveWord } from './constants';
import { ClovaRequestHeader } from './types';
import { ClovaRequestBodyTransformer, requestPost } from './utils';

@Injectable()
export class RepetitiveWordService {
  private readonly apiUrl: string =
    process.env.CLOVASTUDIO_API_BASE_URL +
    process.env.CHAT_COMPLETIONS_ENDPOINT;
  private readonly headers: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeadersForRepetitiveWord;

  public async getRepeatedWord(text: string) {
    const data = ClovaRequestBodyTransformer.makeRepitiveWordCommand(text);

    const res: any = await requestPost(this.apiUrl, data, this.headers);
    return res.data.result.message.content
      .split(',')
      .map((word: string) => word.trim());
  }
}
