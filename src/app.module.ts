import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpellModule } from './spell/spell.module';

@Module({
  imports: [SpellModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}