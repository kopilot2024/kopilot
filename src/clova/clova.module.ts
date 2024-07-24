import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { ClovaService } from './clova.service';
import { FeedbackService } from './feedback.service';
import { ParsedSentenceService } from './parsedSentence.service';
import { PartialModificationService } from './partial-modification.service';

@Module({
  controllers: [ClovaController],
  providers: [
    ClovaService,
    PartialModificationService,
    ParsedSentenceService,
    FeedbackService,
  ],
})
export class ClovaModule {}
