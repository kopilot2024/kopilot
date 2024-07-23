import { Body, Controller, Post } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { FeedbackService } from './feedback.service';
import { SynonymService } from './synonym.service';

@Controller('clova')
export class ClovaController {
  constructor(
    private readonly clovaService: ClovaService,
    private readonly synonymService: SynonymService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post('/synonym')
  synonym(@Body('text') text: string) {
    return this.synonymService.getSynonyms(text);
  }

  @Post('/feedback')
  feedback(
    @Body('tone') tone: string,
    @Body('purpose') purpose: string,
    @Body('text') text: string,
  ) {
    return this.feedbackService.getFeedback(tone, purpose, text);
  }
}
