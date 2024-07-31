import {
  ClovaChatCompletionsResponseBody,
  ClovaCompletionsResponseBody,
  ClovaResponse,
} from '../types';

export class ClovaResponseBodyTransformer {
  static transformIntoResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    return { result: body.message.content };
  }

  static transformIntoSynonymResult(
    body: ClovaCompletionsResponseBody,
  ): ClovaResponse {
    const regex: RegExp = /[1-5]{1}\.\s([가-힣\s]+)/g;

    return {
      result: [...body.text.matchAll(regex)].reduce((acc, curr) => {
        acc.push(curr[1].trim());
        return acc;
      }, []),
    };
  }
}
