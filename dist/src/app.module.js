"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const upload_module_1 = require("./upload/upload.module");
const learning_material_module_1 = require("./learning-material/learning-material.module");
const question_bank_module_1 = require("./question-bank/question-bank.module");
const question_module_1 = require("./question/question.module");
const option_module_1 = require("./option/option.module");
const quiz_module_1 = require("./quiz/quiz.module");
const quiz_attempt_module_1 = require("./quiz-attempt/quiz-attempt.module");
const student_answer_module_1 = require("./student-answer/student-answer.module");
const result_module_1 = require("./result/result.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const resources_module_1 = require("./resources/resources.module");
const parser_job_module_1 = require("./parser-job/parser-job.module");
const assignments_module_1 = require("./assignments/assignments.module");
const attendance_module_1 = require("./attendance/attendance.module");
const classes_module_1 = require("./classes/classes.module");
const students_module_1 = require("./students/students.module");
const notification_module_1 = require("./notification/notification.module");
const audit_log_module_1 = require("./audit-log/audit-log.module");
const subjects_module_1 = require("./subjects/subjects.module");
const users_module_1 = require("./users/users.module");
const my_classes_module_1 = require("./my-classes/my-classes.module");
const study_target_module_1 = require("./study-target/study-target.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            cloudinary_module_1.CloudinaryModule,
            upload_module_1.UploadModule,
            learning_material_module_1.LearningMaterialModule,
            question_bank_module_1.QuestionBankModule,
            question_module_1.QuestionModule,
            option_module_1.OptionModule,
            quiz_module_1.QuizModule,
            quiz_attempt_module_1.QuizAttemptModule,
            student_answer_module_1.StudentAnswerModule,
            result_module_1.ResultModule,
            dashboard_module_1.DashboardModule,
            resources_module_1.ResourcesModule,
            parser_job_module_1.ParserJobModule,
            assignments_module_1.AssignmentsModule,
            attendance_module_1.AttendanceModule,
            classes_module_1.ClassesModule,
            students_module_1.StudentsModule,
            notification_module_1.NotificationModule,
            audit_log_module_1.AuditLogModule,
            subjects_module_1.SubjectsModule,
            users_module_1.UsersModule,
            my_classes_module_1.MyClassesModule,
            study_target_module_1.StudyTargetModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map