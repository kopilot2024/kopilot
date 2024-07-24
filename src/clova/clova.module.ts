import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { ClovaService } from './clova.service';
import { PartialModificationService } from './partial-modification.service';
import { ParsedSentenceService } from './parsedSentence.service';

@Module({
  controllers: [ClovaController],
  providers: [ClovaService, PartialModificationService, ParsedSentenceService],
})
export class ClovaModule {}