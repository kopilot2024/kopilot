import { LoggerModule } from 'src/common/log/logger.module';
import { Module } from '@nestjs/common';
import { SpellController } from './spell.controller';
import { SpellService } from './spell.service';

@Module({
  imports: [LoggerModule],
  controllers: [SpellController],
  providers: [SpellService],
})
export class SpellModule {}
