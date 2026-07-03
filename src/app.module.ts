import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadModule } from './upload/upload.module';
import { LearningMaterialModule } from './learning-material/learning-material.module';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';
import { QuizModule } from './quiz/quiz.module';
import { QuizAttemptModule } from './quiz-attempt/quiz-attempt.module';
import { StudentAnswerModule } from './student-answer/student-answer.module';
import { ResultModule } from './result/result.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ResourcesModule } from './resources/resources.module';
import { ParserJobModule } from './parser-job/parser-job.module';

import { AssignmentsModule } from './assignments/assignments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { NotificationModule } from './notification/notification.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';
import { MyClassesModule } from './my-classes/my-classes.module';
import { StudyTargetModule } from './study-target/study-target.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    UploadModule,
    LearningMaterialModule,
    QuestionBankModule,
    QuestionModule,
    OptionModule,
    QuizModule,
    QuizAttemptModule,
    StudentAnswerModule,
    ResultModule,
    DashboardModule,
    ResourcesModule,
    ParserJobModule,
    AssignmentsModule,
    AttendanceModule,
    ClassesModule,
    StudentsModule,
    NotificationModule,
    AuditLogModule,
    SubjectsModule,
    UsersModule,
    MyClassesModule,
    StudyTargetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
