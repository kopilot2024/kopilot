import { Body, Controller, Post } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { ParsedSentenceService } from './parsedSentence.service';
import { SynonymService } from './synonym.service';

@Controller('clova')
export class ClovaController {
  constructor(
    private readonly clovaService: ClovaService,
    private readonly synonymService: SynonymService,
    private readonly parsedSentenceService: ParsedSentenceService,
  ) {}

  @Post('/synonym')
  synonym(@Body('text') text: string) {
    return this.synonymService.getSynonyms(text);
  }

  @Post('/parsed-line')
  parsedLine(@Body('text') text: string) {
    return this.parsedSentenceService.getParsedSentence(text);
  }
}
