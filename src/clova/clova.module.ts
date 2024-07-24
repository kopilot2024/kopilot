import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { ClovaService } from './clova.service';
import { PartialModificationService } from './partial-modification.service';

@Module({
  controllers: [ClovaController],
  providers: [ClovaService, PartialModificationService],
})
export class ClovaModule {}
