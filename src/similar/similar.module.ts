import { Module } from '@nestjs/common';
import { SimilarService } from './similar.service';
import { SimilarController } from './similar.controller';

@Module({
  controllers: [SimilarController],
  providers: [SimilarService],
})
export class SimilarModule {}
