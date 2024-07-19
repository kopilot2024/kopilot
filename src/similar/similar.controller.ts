import { Body, Controller, Post } from '@nestjs/common';
import { SimilarService } from './similar.service';

@Controller('similar')
export class SimilarController {
  constructor(private readonly similarService: SimilarService) {}
  
  @Post()
  check(@Body('text') text: string) {
    return this.similarService.find(text);
  }
}
