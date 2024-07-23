import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedbackService {
  private readonly apiUrl = process.env.LONG_SENTENCE_API_URL;
  private readonly headers = {
    'X-NCP-CLOVASTUDIO-API-KEY': process.env.X_NCP_CLOVASTUDIO_API_KEY,
    'X-NCP-APIGW-API-KEY': process.env.X_NCP_APIGW_API_KEY,
    'X-NCP-CLOVASTUDIO-REQUEST-ID':
      process.env.LONG_SENTENCE_X_NCP_CLOVASTUDIO_REQUEST_ID,
    'Content-Type': 'application/json',
  };

  async getFeedback(tone: string, purpose: string, text: string): Promise<any> {
    console.log(text);
    const data = {
      messages: [
        {
          role: 'system',
          content: `${purpose}고 ${tone}인 해당 글에 대해 평가해줘\r\n평가 기준은 명확성, 논리적 흐름, 어조와 스타일로 평가와 그 이유도 함께 알려줘\r\n\n`,
        },
        {
          role: 'user',
          content: text,
        },
        {
          role: 'assistant',
          content: '',
        },
      ],
      topP: 0.8,
      topK: 0,
      maxTokens: 256,
      temperature: 0.5,
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
      throw new Error('Failed to fetch evaluation from CLOVA API');
    }
  }
}
