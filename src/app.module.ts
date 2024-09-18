import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { ClovaModule } from './clova/clova.module';
import { RedisModule } from './common/cache/redis/redis.module';
import { ExceptionInterceptor } from './common/exception/exception.interceptor';
import { LoggerModule } from './common/log/logger.module';
import { SpellModule } from './spell/spell.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SpellModule,
    ClovaModule,
    RedisModule.register(),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {}
