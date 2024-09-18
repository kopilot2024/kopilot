import { Logger } from 'winston';
import { Injectable } from '@nestjs/common';
import { winstonLogger } from './winston.logger';

const UNKNOWN: string = 'Unknown';

@Injectable()
export class WinstonService {
  private readonly logger: Logger = winstonLogger();

  debug(message: string, context: string = UNKNOWN, ...args: any): void {
    this.logger.debug(this.makeLogMessage(message, context), ...args);
  }

  info(message: string, context: string = UNKNOWN, ...args: any): void {
    this.logger.info(this.makeLogMessage(message, context), ...args);
  }

  warn(message: string, context: string = UNKNOWN, ...args: any): void {
    this.logger.warn(this.makeLogMessage(message, context), ...args);
  }

  error(message: string, context: string = UNKNOWN, ...args: any): void {
    this.logger.error(this.makeLogMessage(message, context), ...args);
  }

  private makeLogMessage(message: string, context: string): string {
    return `[${context}] ${message}`;
  }
}
