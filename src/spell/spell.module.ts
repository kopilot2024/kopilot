import { Module } from '@nestjs/common';
import { SpellService } from './spell.service';
import { SpellController } from './spell.controller';

@Module({
  controllers: [SpellController],
  providers: [SpellService],
})
export class SpellModule {}
