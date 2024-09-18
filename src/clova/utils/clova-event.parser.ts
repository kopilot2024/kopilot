import { WinstonService } from 'src/common/log/winston/winston.service';
import {
  ClovaChatCompletionsStreamSignal,
  ClovaChatCompletionsStreamToken,
  ClovaEvent,
  ClovaStreamToken,
} from '../types';

const ORIGIN: string = 'ClovaEventParser';

export class ClovaEventParser {
  private static EVENT_PATTERN =
    /id:(?<id>[^\n]+)\nevent:(?<event>[^\n]+)\ndata:(\n)*(?<data>\{.*)(?!\nid:)/;

  private buffer: string = '';

  constructor(private readonly logger: WinstonService) {}

  parse(events: Buffer): ClovaStreamToken[] {
    this.buffer += events.toString();
    const tokens: ClovaStreamToken[] = [];

    while (this.hasCompleteEvent()) {
      const { singleEvent, remainingBuffer } = this.extractEventString(
        this.buffer,
      );
      const token = this.parseSingleEvent(singleEvent);
      if (token) {
        tokens.push(token);
      }
      this.buffer = remainingBuffer;
    }
    return tokens;
  }

  private hasCompleteEvent(): boolean {
    return ClovaEventParser.EVENT_PATTERN.test(this.buffer);
  }

  private extractEventString(buffer: string): {
    singleEvent: string;
    remainingBuffer: string;
  } {
    const match: RegExpExecArray | null =
      ClovaEventParser.EVENT_PATTERN.exec(buffer);

    if (!this.isValidEvent(match)) {
      return { singleEvent: '', remainingBuffer: buffer };
    }

    const { index } = match;
    const singleEvent = match[0];
    const remainingBuffer = buffer.slice(index + singleEvent.length);

    return { singleEvent, remainingBuffer };
  }

  private parseSingleEvent(singleEvent: string): ClovaStreamToken | null {
    const match: RegExpMatchArray | null = singleEvent.match(
      ClovaEventParser.EVENT_PATTERN,
    );

    if (!this.isValidEvent(match)) {
      this.logger.warn('이벤트 파싱에 실패했습니다.\n%s', ORIGIN, singleEvent);
      return null;
    }

    const { event, data } = match.groups;
    try {
      switch (event as ClovaEvent) {
        case 'token':
          return JSON.parse(data) as ClovaChatCompletionsStreamToken;
        case 'signal':
          return JSON.parse(data) as ClovaChatCompletionsStreamSignal;
        case 'result':
          this.logger.debug('스트림을 모두 받았습니다.\n%s', ORIGIN, data);
          return null;
        default:
          return null;
      }
    } catch (err: unknown) {
      this.logger.error('JSON 파싱에 실패했습니다.\n%s', ORIGIN, singleEvent);
    }
  }

  private isValidEvent(match: RegExpExecArray | RegExpMatchArray | null) {
    return match && match.groups;
  }
}
