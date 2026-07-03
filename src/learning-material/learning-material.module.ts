import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LearningMaterialController } from './learning-material.controller';
import { LearningMaterialService } from './learning-material.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ParserJobModule } from '../parser-job/parser-job.module';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
    CloudinaryModule,
    ParserJobModule,
  ],
  controllers: [LearningMaterialController],
  providers: [LearningMaterialService],
  exports: [LearningMaterialService],
})
export class LearningMaterialModule {}
