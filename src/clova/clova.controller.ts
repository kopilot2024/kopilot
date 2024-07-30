import { Body, Controller, Post } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { FeedbackService } from './feedback.service';
import { ParsedSentenceService } from './parsedSentence.service';
import { PartialModificationService } from './partial-modification.service';

@Controller('clova')
export class ClovaController {
  constructor(
    private readonly clovaService: ClovaService,
    private readonly partialModification: PartialModificationService,
    private readonly parsedSentenceService: ParsedSentenceService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post('/partial-modification')
  getPartialModificationResult(
    @Body('input') input: string,
    @Body('command') command: string,
  ) {
    return this.partialModification.getResult(input, command);
  }

  @Post('/parsed-line')
  parsedLine(@Body('text') text: string, @Body('length') length: number) {
    return this.parsedSentenceService.getParsedSentence(text, length);
  }

  @Post('/feedback')
  feedback(
    @Body('tone') tone: string,
    @Body('purpose') purpose: string,
    @Body('text') text: string,
  ) {
    return this.feedbackService.getResult(tone, purpose, text);
  }
}
