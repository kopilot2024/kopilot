import { spellCheckByDAUM } from 'hanspell';
import { WinstonService } from 'src/common/log/winston/winston.service';
import { Injectable } from '@nestjs/common';

const ORIGIN: string = 'SpellService';

@Injectable()
export class SpellService {
  constructor(private readonly logger: WinstonService) {}

  async check(sentence: string): Promise<SpellCheckResult[]> {
    try {
      const chunks = this.splitText(sentence.replace(/<br>/g, '\n'), 1000);
      let results: SpellCheckResult[] = [];

      for (const chunk of chunks) {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            const result = await this.spellCheckAndReturn(chunk, 6000);
            results = results.concat(result as SpellCheckResult[]);
            break;
          } catch (err: unknown) {
            retryCount++;
            if (retryCount >= maxRetries) {
              this.logger.warn(
                '%d번 시도 끝에 맞춤법 검사에 실패했습니다.',
                ORIGIN,
                maxRetries,
              );
            } else {
              this.logger.warn('%d번째 재시도 중입니다.', ORIGIN, retryCount);
              await this.delay(1000); // 잠시 대기 후 재시도
            }
          }
        }
      }
      return results;
    } catch (err: unknown) {
      return [];
    }
  }

  // 딜레이 함수
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
