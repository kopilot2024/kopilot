import { Injectable } from '@nestjs/common';
import { spellCheckByDAUM } from 'hanspell';

@Injectable()
export class AppService {
  async check(sentence: string): Promise<unknown> {
    try {
      return await this.spellCheckAndReturn(sentence, 6000);
    } catch (error) {
      console.error("Error during spell check:", error); // TODO: 로그 출력으로 변경하기
      throw error;
    }

  }

  // return으로 API 수정하기
  async spellCheckAndReturn(sentence: string, timeout: number) {
    return new Promise((resolve, reject) => {
      spellCheckByDAUM(sentence, timeout,
          result => resolve(result), // 성공 시 결과를 resolve
          () => {
          }, // 처리 완료 시 아무 작업 없음
          error => reject(error) // 에러 발생 시 reject
      );
    });
  }

}
