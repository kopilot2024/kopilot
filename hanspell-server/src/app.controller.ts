import {Body, Controller, Get, Post, Render} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @Render('index')
  getPage(): string {
    return;
  }

  @Post()
  check(@Body('sentence') sentence: string) {
    return this.appService.check(sentence);
  }
}
