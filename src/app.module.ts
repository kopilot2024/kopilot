import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpellModule } from './spell/spell.module';
import { SimilarModule } from './similar/similar.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SpellModule, SimilarModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
