import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { ClovaService } from './clova.service';
import { FeedbackService } from './feedback.service';
import { SynonymService } from './synonym.service';

@Module({
  controllers: [ClovaController],
  providers: [ClovaService, SynonymService, FeedbackService],
})
export class ClovaModule {}
