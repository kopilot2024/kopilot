import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { ClovaService } from './clova.service';
import { ParsedSentenceService } from './parsedSentence.service';
import { SynonymService } from './synonym.service';

@Module({
  controllers: [ClovaController],
  providers: [ClovaService, SynonymService, ParsedSentenceService],
})
export class ClovaModule {}
