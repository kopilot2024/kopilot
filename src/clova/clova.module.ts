import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { ClovaService } from './clova.service';
import { FeedbackService } from './feedback.service';
import { ParsedSentenceService } from './parsed-sentence.service';
import { PartialModificationService } from './partial-modification.service';
import { RepetitiveWordService } from './repetitive-word.service';

@Module({
  controllers: [ClovaController],
  providers: [
    ClovaService,
    PartialModificationService,
    ParsedSentenceService,
    FeedbackService,
    RepetitiveWordService,
  ],
})
export class ClovaModule {}
