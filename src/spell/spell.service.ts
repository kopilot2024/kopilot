import { spellCheckByDAUM } from 'hanspell';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpellService {
  async check(sentence: string): Promise<SpellCheckResult[]> {
    try {
      // 텍스트를 1000자 이하로 나눕니다.
      const chunks = this.splitText(sentence, 1000);
      let results: SpellCheckResult[] = [];

      // 각 청크에 대해 맞춤법 검사를 수행합니다.
      for (const chunk of chunks) {
        const result = await this.spellCheckAndReturn(chunk, 6000);
        results = results.concat(result as SpellCheckResult[]);
      }

      return results;
    } catch (error) {
      console.error('Error during spell check:', error); // TODO: 로그 출력으로 변경하기
      throw error;
    }
  }

  // 텍스트를 최대 청크 크기로 나누는 함수
  private splitText(text: string, maxChunkSize: number): string[] {
    const sentences = text.split(/(?<=[.?!])/g); // 문장 부호를 기준으로 나눔
    const chunks: string[] = [];
    let currentChunk = '';

    sentences.forEach((sentence) => {
      if ((currentChunk + sentence).length > maxChunkSize) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    });

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }
  // return으로 API 수정하기
  async spellCheckAndReturn(sentence: string, timeout: number) {
    return new Promise((resolve, reject) => {
      spellCheckByDAUM(
        sentence,
        timeout,
        (result) => resolve(result), // 성공 시 결과를 resolve
        () => {}, // 처리 완료 시 아무 작업 없음
        (error) => reject(error), // 에러 발생 시 reject
      );
    });
  }
}
