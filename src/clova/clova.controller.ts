import { Body, Controller, Post } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { SimilarService } from './similar.service';

@Controller('clova')
export class ClovaController {
  constructor(private readonly clovaService: ClovaService,
    private readonly similarService: SimilarService
  ) {}

  @Post('/similar')
  similar(@Body('text') text: string) {
    return this.similarService.similar(text);
  }

}
