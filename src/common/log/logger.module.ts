import { Module } from '@nestjs/common';
import { WinstonService } from './winston/winston.service';

@Module({
  providers: [WinstonService],
  exports: [WinstonService],
})
export class LoggerModule {}
