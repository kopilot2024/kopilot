import { Module } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { ClovaController } from './clova.controller';
import { SimilarService } from './similar.service';

@Module({
  controllers: [ClovaController],
  providers: [ClovaService, SimilarService],
})
export class ClovaModule {}
