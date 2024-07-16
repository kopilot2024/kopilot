import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { SpellService } from './spell.service';

@Controller('spell')
export class SpellController {
  constructor(private readonly spellService: SpellService) {
  }

  @Get()
  @Render('spell')
  getPage(): string {
    return;
  }

  @Post()
  check(@Body('sentence') sentence: string) {
    return this.spellService.check(sentence);
  }
}
