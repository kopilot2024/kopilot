import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SimilarService {

  private readonly apiUrl = process.env.SIMILAR_API_URL;
  private readonly headers = {
    'X-NCP-CLOVASTUDIO-API-KEY': process.env.X_NCP_CLOVASTUDIO_API_KEY,
      'X-NCP-APIGW-API-KEY': process.env.X_NCP_APIGW_API_KEY,
      'X-NCP-CLOVASTUDIO-REQUEST-ID': process.env.X_NCP_CLOVASTUDIO_REQUEST_ID,
      'Content-Type': 'application/json',
  };

  async find(text: string): Promise<any> {
    const data = {
      text: text,
      start: "의 한국어 유의어 목록은 다음과 같습니다. 1.",
      restart: "",
      includeTokens: true,
      topP: 0.8,
      topK: 0,
      maxTokens: 100,
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: ['6'],
      includeAiFilters: true
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch synonyms from CLOVA API');
    }
  }
}
