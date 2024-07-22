import { Body, Controller, Post } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { SynonymService } from './synonym.service';

@Controller('clova')
export class ClovaController {
  constructor(private readonly clovaService: ClovaService,
    private readonly synonymService: SynonymService
  ) {}

  @Post('/synonym')
  synonym(@Body('text') text: string) {
    return this.synonymService.getSynonyms(text);
  }

}
