import { Body, Controller, Post } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { PartialModificationService } from './partial-modification.service';

@Controller('clova')
export class ClovaController {
  constructor(
    private readonly clovaService: ClovaService,
    private readonly partialModification: PartialModificationService,
  ) {}

  @Post('/partial-modification')
  getPartialModificationResult(
    @Body('input') input: string,
    @Body('command') command: string,
  ) {
    return this.partialModification.getResult(input, command);
  }
}
