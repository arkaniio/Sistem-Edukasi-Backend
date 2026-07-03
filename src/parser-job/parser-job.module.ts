import { Module } from '@nestjs/common';
import { ParserJobController } from './parser-job.controller';
import { ParserJobService } from './parser-job.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParserJobController],
  providers: [ParserJobService],
  exports: [ParserJobService],
})
export class ParserJobModule {}
