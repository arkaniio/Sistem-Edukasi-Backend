import { Module } from '@nestjs/common';
import { StudentAnswerService } from './student-answer.service';

@Module({
  providers: [StudentAnswerService],
  exports: [StudentAnswerService],
})
export class StudentAnswerModule {}
