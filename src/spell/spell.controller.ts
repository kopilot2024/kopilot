import { Body, Controller, Post } from '@nestjs/common';
import { SpellService } from './spell.service';

@Controller('spell')
export class SpellController {
  constructor(private readonly spellService: SpellService) {}

  @Post()
  check(@Body('sentence') sentence: string) {
    return this.spellService.check(sentence);
  }
}
