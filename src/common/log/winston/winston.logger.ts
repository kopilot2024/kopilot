import { Logger, createLogger } from 'winston';
import { customFormat } from './winston.format';
import {
  debugTransports,
  errorTransports,
  infoTransports,
  warnTransports,
} from './winston.transport';

export const winstonLogger = (): Logger =>
  createLogger({
    format: customFormat(),
    transports: [
      debugTransports,
      infoTransports,
      warnTransports,
      errorTransports,
    ],
  });
