import {
  ClovaChatCompletionsResponseBody,
  ClovaCompletionsResponseBody,
  ClovaResponse,
} from '../types';
import { Feedback } from '../types/feedback/feedback.type';

export class ClovaResponseBodyTransformer {
  static transformIntoResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    return { result: body.message.content };
  }

  static transformIntoSynonymResult(
    body: ClovaCompletionsResponseBody,
  ): ClovaResponse {
    const regex: RegExp = /[1-5]{1}\)\s([가-힣\s]+)/g;

    return {
      result: [...body.text.matchAll(regex)].reduce((acc, curr) => {
        acc.push(curr[1].trim());
        return acc;
      }, []),
    };
  }

  static transformIntoFeedBackResult(
    body: ClovaChatCompletionsResponseBody,
  ): Feedback[] {
    const sections = body.message.content.trim().split(/\n\n/);
    const result = sections
      .map((section) => {
        const [titleLine, ...descriptionLines] = section.split('\n');
        const titleMatch = titleLine.match(/^-\s*(.*?)\s*:\s*(.*)$/);
        if (!titleMatch) return null;

        const title = titleMatch[1];
        const score = titleMatch[2];
        const description = descriptionLines.join(' ').trim();

        return {
          title: title,
          score: score,
          description: description,
        };
      })
      .filter((item) => item !== null);

    return result;
  }
}
