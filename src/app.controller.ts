import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { MODIFICATION_OPTIONS } from './clova/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(): any {
    return { modificationOptions: MODIFICATION_OPTIONS };
  }
}
