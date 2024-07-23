import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParsedSentenceService {
  private readonly apiUrl = process.env.LONG_SENTENCE_API_URL;
  private readonly headers = {
    'X-NCP-CLOVASTUDIO-API-KEY': process.env.X_NCP_CLOVASTUDIO_API_KEY,
    'X-NCP-APIGW-API-KEY': process.env.X_NCP_APIGW_API_KEY,
    'X-NCP-CLOVASTUDIO-REQUEST-ID':
      process.env.LONG_SENTENCE_X_NCP_CLOVASTUDIO_REQUEST_ID,
    'Content-Type': 'application/json',
  };

  async getParsedSentence(text: string): Promise<any> {
    const data = {
      messages: [
        {
          role: 'system',
          content:
            '문장이 100자가 넘는다면, 한 문장을 100자 미만으로 나눠줘. 결과는 나뉜 문장을 줄글로 보여줘.',
        },
        {
          role: 'user',
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

    try {
      const response = await axios.post(this.apiUrl, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      );
      throw new Error('Failed to fetch parsed sentence from CLOVA API');
    }
  }
}
