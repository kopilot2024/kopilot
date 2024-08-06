import * as dotenv from 'dotenv';
import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { MODIFICATION_OPTIONS } from './clova/constants';

dotenv.config();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(): any {
    return {
      apiBaseUrl: process.env.BACKEND_API_BASE_URL,
      modificationOptions: MODIFICATION_OPTIONS,
    };
  }
}
