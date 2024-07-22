import { Module } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { ClovaController } from './clova.controller';
import { SynonymService } from './synonym.service';

@Module({
  controllers: [ClovaController],
  providers: [ClovaService, SynonymService],
})
export class ClovaModule {}
