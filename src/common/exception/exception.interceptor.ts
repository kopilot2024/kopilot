import { Observable, catchError, throwError } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WinstonService } from '../log/winston/winston.service';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const controllerName: string = context.getClass().name;

    return next.handle().pipe(
      catchError((err: unknown) => {
        this.logger.error(this.makeLogMessage(err), controllerName);
        return throwError(() => err);
      }),
    );
  }

  private makeLogMessage(err: unknown): string {
    return err instanceof Error ? err.message : JSON.stringify(err);
  }
}
