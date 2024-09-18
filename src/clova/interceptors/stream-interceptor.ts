import { Observable } from 'rxjs';
import { WinstonService } from 'src/common/log/winston/winston.service';
import { Readable, Transform, Writable } from 'stream';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { STREAM_REQUEST_HEADER } from '../constants';
import { ClovaStreamToken } from '../types';
import { ClovaEventParser } from '../utils';

const ORIGIN: string = 'StreamInterceptor';

@Injectable()
export class StreamInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const response: any = ctx.getResponse();

    response.set(STREAM_REQUEST_HEADER);

    return new Observable(() => {
      next.handle().subscribe({
        next: (_) => {
          const reader = _.body.getReader();

          const readableStream: Readable = new Readable({
            read() {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    this.push(null);
                  } else {
                    this.push(value);
                  }
                })
                .catch((err) => this.destroy(err));
            },
          });

          const clovaEventParser: ClovaEventParser = new ClovaEventParser(
            this.logger,
          );

          const transformStream: Transform = new Transform({
            transform(chunk, _, callback) {
              const tokens: ClovaStreamToken[] = clovaEventParser.parse(chunk);

              for (const token of tokens) {
                if (token && 'message' in token) {
                  this.push(token.message.content);

                  if (token.stopReason) {
                    switch (token.stopReason) {
                      case 'length':
                        this.emit(
                          'error',
                          new Error('토큰 길이 제한을 초과했습니다.'),
                        );
                      default:
                        this.push(null);
                    }
                  }
                }
              }
              callback();
            },
          });

          const writableStream: Writable = new Writable({
            write(chunk, _, callback) {
              response.write(chunk);
              callback();
            },
            final(callback) {
              response.end();
              callback();
            },
          });

          readableStream
            .pipe(transformStream)
            .pipe(writableStream)
            .on('finish', () => response.end())
            .on('error', () => response.end());

          readableStream.on('error', (err: unknown) => {
            this.logger.error(JSON.stringify(err), ORIGIN);
            response.end();
          });

          transformStream.on('error', (err: unknown) => {
            this.logger.error(JSON.stringify(err), ORIGIN);
            response.write(
              JSON.stringify({
                error: err instanceof Error ? err.message : err,
              }),
            );
            response.end();
          });

          writableStream.on('error', (err: unknown) => {
            this.logger.error(JSON.stringify(err), ORIGIN);
            response.end();
          });
        },
        error: (err: unknown) => {
          this.logger.error(JSON.stringify(err), ORIGIN);
          response.status(500).send();
        },
      });
    });
  }
}
