import { Module } from '@nestjs/common';
import { StudyTargetService } from './study-target.service';
import { StudyTargetController } from './study-target.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StudyTargetService],
  controllers: [StudyTargetController],
})
export class StudyTargetModule {}
