import * as Handlebars from 'express-handlebars';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'views'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const handlebars = Handlebars.create({
    partialsDir: join(__dirname, '..', 'views/partials'),
    extname: '.hbs',
  });
  app.engine('hbs', handlebars.engine);

  await app.listen(3000);
}

bootstrap();
