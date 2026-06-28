import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ResultsModule } from './results/results.module';
import { ResourcesModule } from './resources/resources.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { OptionController } from './option/option.controller';
import { OptionService } from './option/option.service';
import { StudentAnswerController } from './student-answer/student-answer.controller';
import { StudentAnswerService } from './student-answer/student-answer.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DashboardModule,
    ResultsModule,
    AnnouncementsModule,
    ResourcesModule,
    StudentsModule,
    ClassesModule,
    AttendanceModule,
    AssignmentsModule,
  ],
  controllers: [
    AppController,
    QuizController,
    QuestionController,
    OptionController,
    StudentAnswerController,
  ],
  providers: [
    AppService,
    QuizService,
    QuestionService,
    OptionService,
    StudentAnswerService,
  ],
})
export class AppModule {}
